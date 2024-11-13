import { DesignerToolbarSettings } from '@/interfaces/toolbarSettings';

export const getSettings = () =>
  new DesignerToolbarSettings()
    .addTextField({
        id: '8c898413-7dfd-4322-b610-fce8c35756f8',
        propertyName: 'label',
        label: 'Label',
        })
    .toJson();
