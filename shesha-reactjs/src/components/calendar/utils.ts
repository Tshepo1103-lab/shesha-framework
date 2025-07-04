import { evaluateDynamicFilters } from '@/utils';
import { IStoredFilter } from '@/publicJsApis/dataTableContextApi';
import { IAnyObject, IMatchData } from '@/index';
import { UseEvaluatedFilterArgs } from '@/providers/dataTable/filters/evaluateFilter';
import { NestedPropertyMetadatAccessor } from '@/providers/metadataDispatcher/contexts';
import { ICalendarLayersProps } from '@/providers/calendar/models';

export const parseIntOrDefault = (input: any, defaultValue: number = 0): number => {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const getLayerMarkerPoints = (
  item: ICalendarLayersProps,
  layerDataItem: { [x: string]: any }[] | { [x: string]: any },
) => {
  let markers;
  const { startTime, endTime, title, color, onSelect, onDblClick } = item;

  if (Array.isArray(layerDataItem)) {
    markers = layerDataItem
      .filter((i) => i?.[startTime] && i?.[endTime])
      .map((j) => ({
        id: j?.id,
        title: j?.[title],
        start: new Date(j?.[startTime]),
        end: new Date(j?.[endTime]),
        color,
        onSelect,
        onDblClick
      }));
  } else {
    markers = [
      {
        title: layerDataItem?.[title],
        start: new Date(layerDataItem?.[startTime]),
        end: new Date(layerDataItem?.[endTime]),
        color,
        onSelect,
        onDblClick
      },
    ];
  }

  return { ...item, markers };
};

export const getLayerMarkers = (layers: ICalendarLayersProps[], layerData: { [x: string]: any }[]): ICalendarLayersProps[] =>
  (layers || []).map((item, index) => {
    const layerDataItem = (layerData[index] as any[]) || [];

    return getLayerMarkerPoints(item, layerDataItem);
  });

export const getLayerMarkerOptions = (layers: ICalendarLayersProps[]) =>
  (layers || [])
    .filter((item) => item.visible)
    .map((i) => ({
      label: i.label,
      value: i.id,
      disabled: !i.allowChangeVisibility,
    }));

export const getQueryProperties = ({startTime, endTime, title }: ICalendarLayersProps) => {
  const properties = new Set<string>(['id']);
  properties.add(startTime).add(endTime).add(title);

  return Array.from(properties).join(' ');
};


export const getCalendarRefetchParams = (param: ICalendarLayersProps, filter: string) => {
  const { customUrl, dataSource, entityType } = param;

  if (dataSource === 'custom') {
    return {
      path: customUrl,
    };
  }

  return {
    path: `/api/services/app/Entities/GetAll`,
    queryParams: {
      entityType,
      properties: getQueryProperties(param),
      maxResultCount: 100,
      filter,
    },
  };
};

export const getMarkerPoints = (layerMarker: ICalendarLayersProps[], checked: string[]) =>
  checked
    .map(
      (item) => layerMarker.find(({ id }) => id === item)?.markers as any[],
    )
    .filter((i) => i)
    .reduce((prev, curr) => [...(prev || []), ...(curr || [])], []);

export const getResponseListToState = (res: { [key in string]: any }[]) =>
  res.map((res) => (res?.result?.items ? res.result.items : res?.result));

export const addPx = (value: string) => {
  value = value ?? "100%";
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};


export const evaluateFilterAsync = async (args: UseEvaluatedFilterArgs): Promise<string> => {
  const { filter, mappings, metadataAccessor } = args;

  if (!filter) return '';

  const preparedMappings: IMatchData[] = [];
  mappings.forEach((item) => {
    const { prepare, ...restItemProps } = item;
    const preparedData = item.prepare ? item.prepare(item.data) : item.data;
    preparedMappings.push({ ...restItemProps, data: preparedData });
  });

  // Evaluate the filters asynchronously
  const response = await evaluateDynamicFilters(
    [{ expression: filter } as IStoredFilter],
    preparedMappings,
    metadataAccessor,
  );

  // Return the evaluated filter expression or an empty string if it's not found
  return JSON.stringify(response[0]?.expression) || '';
};


export const evaluateFilters = async (
  item: any,
  formData: any,
  globalState: IAnyObject,
  propertyMetadataAccessor: NestedPropertyMetadatAccessor,
): Promise<string> => {
  if (!item.filters) return '';

  const evaluatedFilters = await evaluateFilterAsync({
    filter: item.filters,
    mappings: [
      {
        match: 'data',
        data: formData,
      },
      {
        match: 'globalState',
        data: globalState,
      },
    ],
    metadataAccessor: propertyMetadataAccessor,
  });

  return evaluatedFilters;
};