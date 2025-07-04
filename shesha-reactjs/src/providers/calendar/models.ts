import { FormIdentifier } from '@/interfaces';
import { IConfigurableFormComponent } from '@/interfaces/formDesigner';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { View } from 'react-big-calendar';
import { IConfigurableActionConfiguration } from '../configurableActionsDispatcher';

export type LayerGroupItemProps = ILayerFormModel | ILayerGroup;

export interface ILayerGroupItemBase {
  id: string;
  name: string;
  block?: boolean;
  label?: string;
  tooltip?: string;
  sortOrder: number;
  danger?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  isDynamic?: boolean;
  icon?: string;
  LayerType?: 'point' | 'polygon';
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  style?: string;
  size?: SizeType;
  visible?: boolean;
  allowChangeVisibility?: boolean;
  useQuickView?: boolean;
  quickViewForm?: FormIdentifier;
}

export interface ILayerFormModel extends ILayerGroupItemBase {
  label?: string;
  orderIndex?: number;
  description?: string;
  visible?: boolean;
  allowChangeVisibility?: boolean;
  useExpression?: boolean;
  entityType?: string;
  permissions?: any;
  properties?: string[];
  queryParamsExpression?: string;
  readOnly?: boolean;
  icon?: string;
  iconColor?: {
    hex: string;
  };
  customUrl?: string;
  dataSource?: 'entity' | 'custom';
  layertype?: 'points' | 'polygon';
  boundary?: string;
  longitude?: string;
  latitude?: string;
}

export interface ILayerGroup extends ILayerGroupItemBase {
  childItems?: LayerGroupItemProps[];
}


export interface ICalendarProps extends IConfigurableFormComponent {
  items?: ICalendarLayersProps[];
  startDate?: string;
  width?: number;
  height?: number;
  displayPeriod?: View[];
}

export interface ICalendarLayersProps {
  id: string;
  sortOrder: number;
  name: string;
  label: string;
  description: string;
  visible?: boolean;
  allowChangeVisibility?: boolean;
  dataSource: 'entity' | 'custom';
  entityType?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  color?: {
    hex: string;
  };
  customUrl?: string;
  ownerId?: string;
  filters: { [key in string]: any };
  useQuickView?: boolean;
  quickViewForm?: FormIdentifier;
  markers?: any[];
  onSelect?: IConfigurableActionConfiguration;
  onDblClick?: IConfigurableActionConfiguration;
}