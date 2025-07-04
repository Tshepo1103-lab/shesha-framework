import { createContext } from 'react';
import { LayerGroupItemProps } from './models';

export interface IUpdateChildItemsPayload {
  index: number[];
  id?: string;
  childs: LayerGroupItemProps[];
}

export interface IUpdateItemSettingsPayload {
  id: string;
  settings: LayerGroupItemProps;
}

export interface ILayerGroupConfiguratorStateContext {
  items: LayerGroupItemProps[];
  selectedItemId?: string;
  readOnly: boolean;
}

export interface ILayerGroupConfiguratorActionsContext {
  addLayer: () => void;
  deleteLayer: (uid: string) => void;
  selectItem: (uid: string) => void;
  updateItem: (payload: IUpdateItemSettingsPayload) => void;
  getItem: (uid: string) => LayerGroupItemProps;
  updateChildItems: (payload: IUpdateChildItemsPayload) => void;
}

export const LAYER_GROUP_CONTEXT_INITIAL_STATE: ILayerGroupConfiguratorStateContext = {
  items: [],
  readOnly: false,
};

export const LayerGroupConfiguratorStateContext = createContext<ILayerGroupConfiguratorStateContext>(
  LAYER_GROUP_CONTEXT_INITIAL_STATE
);

export const LayerGroupConfiguratorActionsContext = createContext<ILayerGroupConfiguratorActionsContext>(undefined);
