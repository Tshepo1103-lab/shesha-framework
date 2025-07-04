
  import { useState } from 'react';
  import { getLayerMarkers, getCalendarRefetchParams, getResponseListToState, evaluateFilters } from './utils';
  import { View } from 'react-big-calendar';
import { ICalendarLayersProps } from '@/providers/calendar/models';
import { useGet, useMutate } from '@/hooks';
import { evaluateString, useFormData, useGlobalState, useNestedPropertyMetadatAccessor } from '@/index';
  
  interface IGetData {
    fetchData: () => void;
    fetchDefaultCalendarView: () => Promise<ISettingResponse>;
    layerData: { [key in string]: any }[];
    layerMarkers: ICalendarLayersProps[];
    updateDefaultCalendarView: (value: string) => Promise<any>;
  }
  
  interface ISettingResponse {
    success: boolean;
    result: View;
  }
  
  export const useMetaMapMarker = (layers: ICalendarLayersProps[]): IGetData => {
    const [state, setState] = useState<Pick<IGetData, 'layerData'>>({
      layerData: [],
    });
  
    const { mutate } = useMutate<any>();
  
    const { layerData } = state;
  
    const { data: formData } = useFormData();
  
    const { globalState } = useGlobalState();
  
    const { refetch } = useGet({ path: '', lazy: true });
  
    const layerMarkers = getLayerMarkers(layers, layerData) || [];
  
    const layerWithMetadata = layers?.map(obj => {
      return {
        ...obj,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        metadata: useNestedPropertyMetadatAccessor(obj.entityType)
      };
    });
  
    const fetchData = () => {
      Promise.all(
        layerWithMetadata?.map(
          (item) =>
            new Promise(async (resolve, reject) => {
              const filter = await evaluateFilters(item, formData, globalState, item.metadata);
  
              const evalCustomUrl = evaluateString(item.customUrl, { data: formData, globalState });
  
              refetch(getCalendarRefetchParams({ ...item, customUrl: evalCustomUrl }, filter))
                .then(resolve)
                .catch(reject);
            }),
        ),
      )
        .then((resp) => setState((s) => ({ ...s, layerData: getResponseListToState(resp) })))
        .catch(() => setState((s) => ({ ...s, layerData: [] })));
    };
  
  
    const updateDefaultCalendarView = async (value: string) => {
      try {
        const response = await mutate(
          {
            url: '/api/services/app/Settings/UpdateUserValue',
            httpVerb: 'POST',
          },
          {
            name: 'Calendar View',
            module: 'Shesha',
            value: value,
            datatype: 'string',
          }
        );
  
        if (response?.success) {
          return response;
        }
      } catch (error) {
        console.error('Error updating user settings:', error);
      }
    };
  
  
    const fetchDefaultCalendarView = async (): Promise<ISettingResponse> => {
      try {
        const response = await mutate(
          {
            url: '/api/services/app/Settings/GetUserValue',
            httpVerb: 'POST'
          },
          {
            name: 'Calendar View',
            module: 'Shesha'
          }
        );
  
        if (response?.success && response?.result !== undefined) {
          return response;
        } else {
          console.warn('Unexpected response format or result missing');
          return null;  // Return an empty string as a fallback
        }
      } catch (error) {
        console.error('Error fetching default calendar view:', error);
        return null;  // Return an empty string in case of error
      }
    };
  
    return {
      fetchData,
      layerMarkers,
      layerData,
      fetchDefaultCalendarView,
      updateDefaultCalendarView
    };
  };
  