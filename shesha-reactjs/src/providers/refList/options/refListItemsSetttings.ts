import { DesignerToolbarSettings } from '@/interfaces/toolbarSettings';
import { nanoid } from 'nanoid';

export const componentsSettings = (type: any) => {
  console.log('typeToMakeDecisions', type);
  return(
    new DesignerToolbarSettings()

        .addCheckbox({
          id: nanoid(),
          propertyName: 'hidden',
          label: 'Hidden',
          defaultValue: true,
        })
        .addCheckbox({
            id: nanoid(),
            propertyName: 'disabled',
            label: 'Disabled',
            defaultValue: true,
            hidden: type === 'segmented' ? false : true,
          })
          .addIconPicker({
            id: nanoid(),
            propertyName: 'icon',
            label: 'Icon',
            parentId: 'root',
            hidden: type === 'segmented' ? false : true,
          })
        .addColorPicker({
            id: nanoid(),
            propertyName: 'backgroundColor',
            parentId: 'root',
            label: 'Background Color',
            allowClear: true,
            hidden: type === 'segmented' ? false : true,
        })
        .addConfigurableActionConfigurator({
            id: nanoid(),
            propertyName: 'actionConfiguration',
            label: 'Action configuration',
            hidden: false,
            validate: {},
            settingsValidationErrors: [],
          })
).toJson()


}
