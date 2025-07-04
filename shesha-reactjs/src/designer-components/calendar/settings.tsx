import { Form, Input, Select } from 'antd';
import React, { FC, useState } from 'react';
import CalendarSelectorSettingsModal from '../../components/calendar/options/modal';
import { ICalendarProps } from '@/providers/calendar/models';
import { SectionSeparator } from '@/components';

export interface ITabSettingsProps {
  readOnly: boolean;
  model: ICalendarProps;
  onSave: (model: ICalendarProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: any) => void;
}

const { Option } = Select;

const CalendarSettings: FC<ITabSettingsProps> = (props) => {
  const [state, setState] = useState(props?.model);
  const [form] = Form.useForm();

  const onValuesChange = (changedValues: any, values: any) => {
    const newValues = { ...state, ...values };
    if (props.onValuesChange) props.onValuesChange(changedValues, newValues);
  };

  const handleValuesChange = (changedValues: ICalendarProps, values: ICalendarProps) => {
    if (state.readOnly) return;
    const incomingState = { ...values };

    setState(incomingState);
    onValuesChange(changedValues, incomingState);
  };

  return (
    <Form
      initialValues={props.model.displayPeriod ? props.model : { ...props.model, displayPeriod: ['month', 'week', 'day', 'work_week', 'agenda'] }}
      form={form}
      onFinish={props.onSave}
      onValuesChange={handleValuesChange}
      labelCol={{ span: 24 }}
      disabled={props.readOnly}
    >
      <SectionSeparator title="Display" />

      <Form.Item name="displayPeriod" label="Default Display Period" tooltip="The period visible to the user on the calendar component (Month, Week, Work-week, Day, Agenda)">
        <Select disabled={state.readOnly} mode='multiple' value={['month']}>
          <Option value="month">Month</Option>
          <Option value="week">Week</Option>
          <Option value="work_week">Work Week</Option>
          <Option value="day">Day</Option>
          <Option value="agenda">Agenda</Option>

        </Select>
      </Form.Item>

      <SectionSeparator title="Calenders" />
      <Form.Item name="items">
        <CalendarSelectorSettingsModal readOnly={props.readOnly} />
      </Form.Item>

      <Form.Item name="width" label="Width" tooltip="Width in px - defaulted to 100vw">
        <Input type="number" />
      </Form.Item>

      <Form.Item name="height" label="Height" tooltip="Height in px - defaulted to 100vh">
        <Input type="number" />
      </Form.Item>

    </Form>
  );
};

export default CalendarSettings;
