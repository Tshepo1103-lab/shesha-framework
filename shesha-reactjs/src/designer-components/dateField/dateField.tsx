import { CalendarOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import { customDateEventHandler } from '@/components/formDesigner/components/utils';
import { IToolboxComponent } from '@/interfaces';
import { DataTypes } from '@/interfaces/dataTypes';
import { FormMarkup, IInputStyles } from '@/providers/form/models';
import { useAvailableConstantsData, validateConfigurableComponentSettings } from '@/providers/form/utils';
import { IDateFieldProps } from './interfaces';
import settingsFormJson from './settingsForm.json';
import {
  DATE_TIME_FORMATS,
} from './utils';
import { migratePropertyName, migrateCustomFunctions, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import { DatePickerWrapper } from './datePickerWrapper';
import { migrateFormApi } from '../_common-migrations/migrateFormApi1';

const settingsForm = settingsFormJson as FormMarkup;

const DateField: IToolboxComponent<IDateFieldProps> = {
  type: 'dateField',
  name: 'Date field',
  isInput: true,
  isOutput: true,
  canBeJsSetting: true,
  icon: <CalendarOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.date || dataType === DataTypes.dateTime,
  Factory: ({ model }) => {
    const allData = useAvailableConstantsData();

    return (
      <Fragment>
        <ConfigurableFormItem model={model}>
          {(value, onChange) => {
            const customEvent = customDateEventHandler(model, allData);
            const onChangeInternal = (...args: any[]) => {
              customEvent.onChange(args[0], args[1]);
              if (typeof onChange === 'function')
                onChange(...args);
            };

            return <DatePickerWrapper {...model} {...customEvent} value={value} onChange={onChangeInternal} />;
          }}
        </ConfigurableFormItem>
      </Fragment>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
  initModel: (model) => {
    const customModel: IDateFieldProps = {
      ...model,
      picker: 'date',
      showTime: false,
      dateFormat: DATE_TIME_FORMATS?.date,
      timeFormat: DATE_TIME_FORMATS.time,
      defaultToMidnight: true,
    };
    return customModel;
  },
  migrator: (m) => m
    .add<IDateFieldProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<IDateFieldProps>(1, (prev) => migrateVisibility(prev))
    .add<IDateFieldProps>(2, (prev) => migrateReadOnly(prev))
    .add<IDateFieldProps>(3, (prev) => ({ ...migrateFormApi.eventsAndProperties(prev) }))
    .add<IDateFieldProps>(4, (prev) => ({
      ...prev,
      showNow: Boolean(prev.showNow || prev['showToday'])
    }))
    .add<IDateFieldProps>(5, (prev) => {
      const styles: IInputStyles = {
        size: prev.size,
        hideBorder: prev.hideBorder,
        style: prev.style
      };

      return { ...prev, desktop: {...styles}, tablet: {...styles}, mobile: {...styles} };
    })
  ,
  linkToModelMetadata: (model, metadata): IDateFieldProps => {

    return {
      ...model,
      dateFormat: !!metadata.dataFormat ? metadata.dataFormat : model.dateFormat,
      showTime: metadata.dataType === DataTypes.date ? false : model.showTime,
    };
  },
};

export default DateField;