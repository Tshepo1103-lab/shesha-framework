import { createAction } from 'redux-actions';
import { ISettingsUpdatePayload, IUpdateChildItemsPayload, IUpdateItemSettingsPayload } from './contexts';

export enum RefListItemGroupActionEnums {
  AddItem = 'ADD_ITEM',
  DeleteItem = 'DELETE_ITEM',
  UpdateItem = 'UPDATE_ITEM',
  SelectItem = 'SELECT_ITEM',
  UpdateChildItems = 'UPDATE_CHILD_ITEMS',
  SetItems = 'SET_ITEMS',
  StoreSettings = 'STORE_SETTINGS',
}

export const setItems = createAction<any[], any[]>(RefListItemGroupActionEnums.SetItems, (p) => p);

export const selectItemAction = createAction<string, string>(RefListItemGroupActionEnums.SelectItem, (p) => p);

export const updateItemAction = createAction<IUpdateItemSettingsPayload, IUpdateItemSettingsPayload>(
  RefListItemGroupActionEnums.UpdateItem,
  (p) => p
);

export const updateChildItemsAction = createAction<IUpdateChildItemsPayload, IUpdateChildItemsPayload>(
  RefListItemGroupActionEnums.UpdateChildItems,
  (p) => p
);

export const storeSettingsAction = createAction<ISettingsUpdatePayload>(
  RefListItemGroupActionEnums.StoreSettings
);

export const addLayerAction = createAction(RefListItemGroupActionEnums.AddItem);

export const deleteLayerAction = createAction<string, string>(RefListItemGroupActionEnums.DeleteItem, (p) => p);