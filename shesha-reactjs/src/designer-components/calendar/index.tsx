/* eslint-disable react-hooks/rules-of-hooks */
import { FolderOpenOutlined } from '@ant-design/icons';
import React from 'react';
import CalendarSettings from './settings';
import CalendarControl from '../../components/calendar';
import { CalendarActionsAccessor } from '../../components/calendar/configurable-actions/calendar-actions-processor';
import { IToolboxComponent } from '@/interfaces/formDesigner';
import { ICalendarProps } from '@/providers/calendar/models';

const CalendarComponent: IToolboxComponent<ICalendarProps> = {
  type: 'calendar',
  isInput: true,
  name: 'Calendar',
  icon: <FolderOpenOutlined />,
  Factory: ({ model }) => {
    const { description } = model;

    if (model.hidden) return null;

    return (
      <CalendarActionsAccessor items={model.items} >
        <CalendarControl
          {...model}
          description={description}
        />
      </CalendarActionsAccessor>
    );
  },
  settingsFormFactory: ({ readOnly, model, onSave, onCancel, onValuesChange }) => {
    return (
      <CalendarSettings
        readOnly={readOnly}
        model={model}
        onSave={onSave}
        onCancel={onCancel}
        onValuesChange={onValuesChange}
      />
    );
  },
};

export default CalendarComponent;
