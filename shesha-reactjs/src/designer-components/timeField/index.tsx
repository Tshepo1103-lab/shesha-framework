import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import { customTimeEventHandler } from '@/components/formDesigner/components/utils';
import { IToolboxComponent } from '@/interfaces';
import { DataTypes } from '@/interfaces/dataTypes';
import { IInputStyles } from '@/providers';
import { FormMarkup } from '@/providers/form/models';
import { useAvailableConstantsData, validateConfigurableComponentSettings } from '@/providers/form/utils';
import settingsFormJson from './settingsForm.json';
import { migratePropertyName, migrateCustomFunctions, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import { ITimePickerProps } from './models';
import { TimePickerWrapper } from './timePickerWrapper';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';
import { getSettings } from './settings';

const DATE_TIME_FORMAT = 'HH:mm';

const settingsForm = settingsFormJson as FormMarkup;

export const TimeFieldComponent: IToolboxComponent<ITimePickerProps> = {
  type: 'timePicker',
  name: 'Time Picker',
  isInput: true,
  isOutput: true,
  canBeJsSetting: true,
  icon: <ClockCircleOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.time,
  Factory: ({ model }) => {
    const allData = useAvailableConstantsData();

    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => {
          const customEvent = customTimeEventHandler(model, allData);
          const onChangeInternal = (...args: any[]) => {
            customEvent.onChange(args[0], args[1]);
            if (typeof onChange === 'function')
              onChange(...args);
          };
          return <TimePickerWrapper {...model} {...customEvent} value={value} onChange={onChangeInternal} />;
        }}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
  initModel: (model) => {
    const customModel: ITimePickerProps = {
      ...model,
      format: DATE_TIME_FORMAT,
    };
    return customModel;
  },
  migrator: (m) => m
    .add<ITimePickerProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<ITimePickerProps>(1, (prev) => migrateVisibility(prev))
    .add<ITimePickerProps>(2, (prev) => migrateReadOnly(prev))
    .add<ITimePickerProps>(3, (prev) => ({ ...migrateFormApi.eventsAndProperties(prev) }))
    .add<ITimePickerProps>(4, (prev) => {
      const styles: IInputStyles = {
        size: prev.size,
        hideBorder: prev.hideBorder,
        style: prev.style
      };

      return { ...prev, desktop: { ...styles }, tablet: { ...styles }, mobile: { ...styles } };
    })
  ,
  linkToModelMetadata: (model, metadata): ITimePickerProps => {

    return {
      ...model,
      format: metadata.dataFormat ? metadata.dataFormat : DATE_TIME_FORMAT,
    };
  },
};