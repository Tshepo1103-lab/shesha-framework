import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import React from 'react';
import { FormatPainterOutlined } from '@ant-design/icons';
import { IColorPickerComponentProps } from './interfaces';
import { getSettings } from './settingsForm';
import { IToolboxComponent } from '@/interfaces';
import { migrateCustomFunctions, migratePropertyName } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import { validateConfigurableComponentSettings } from '@/providers/form/utils';
import { ColorPicker } from '@/components';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';

const ColorPickerComponent: IToolboxComponent<IColorPickerComponentProps> = {
  type: 'colorPicker',
  name: 'Color Picker',
  canBeJsSetting: true,
  isInput: true,
  isOutput: true,
  icon: <FormatPainterOutlined />,
  Factory: ({ model }) => {
    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => (
          <ColorPicker
            value={value}
            onChange={onChange}
            title={model.title}
            allowClear={model.allowClear}
            showText={model.showText}
            disabledAlpha={model.disabledAlpha}
            readOnly={model.readOnly}
            size={model.size}
          />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  migrator: (m) => m
    .add<IColorPickerComponentProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<IColorPickerComponentProps>(1, (prev) => migrateVisibility(prev))
    .add<IColorPickerComponentProps>(2, (prev) => ({ ...prev, allowClear: false, showText: false }))
    .add<IColorPickerComponentProps>(3, (prev) => ({...migrateFormApi.properties(prev)}))
  ,
  validateSettings: model => validateConfigurableComponentSettings(getSettings, model),
};

export default ColorPickerComponent;
