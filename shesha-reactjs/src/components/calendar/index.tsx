import React, { FC, useEffect, useState } from 'react';
import { Checkbox, Dropdown, Empty, Menu } from 'antd';
import { useMetaMapMarker } from './hooks';
import { useDeepCompareEffect } from 'react-use';
import { addPx, getLayerMarkerOptions, getMarkerPoints } from './utils';
import { DownOutlined } from '@ant-design/icons';
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ICalendarLayersProps, ICalendarProps } from '@/providers/calendar/models';
import { useConfigurableActionDispatcher, useFormData } from '@/providers';

moment.locale("en-za");
const localizer = momentLocalizer(moment);

export const CalendarControl: FC<ICalendarProps> = (props) => {
  const { executeAction } = useConfigurableActionDispatcher();
  const { items, displayPeriod, width, height } = props;
  const [points, setPoints] = useState<any>([]);
  const [defaultView, setDefaultView] = useState<View>(displayPeriod?.[0]);
  const { data } = useFormData();

  const { layerMarkers, fetchData, fetchDefaultCalendarView, updateDefaultCalendarView } = useMetaMapMarker(items);

  useEffect(() => {
    fetchData();
    fetchDefaultCalendarView().then((response) => setDefaultView(response.result ? response.result : displayPeriod?.[0]) )
    .catch(() => setDefaultView(displayPeriod?.[0]));
  }, [data]);

  const defaultChecked = getLayerMarkerOptions(items)?.map((item) => item.value);

  useDeepCompareEffect(() => {
    setPoints(getMarkerPoints(layerMarkers, defaultChecked));
  }, [layerMarkers]);

  const onChange = (checked: string[]) => {
    setPoints(getMarkerPoints(layerMarkers, checked as string[]));
  };

  const menu = (
    <Menu style={{ display: 'block', padding: '20px', opacity: 0.9 }}>
      <Checkbox.Group options={getLayerMarkerOptions(items)} onChange={onChange} defaultValue={defaultChecked} />
    </Menu>
  );

  const handleCustomSelect = (event: ICalendarLayersProps) => {
    const evaluationContext = {
      points,
      selectedRow: event,
    };

    executeAction({
      actionConfiguration: event.onSelect,
      argumentsEvaluationContext: evaluationContext,
    });
  };

  const handleCustomDoubleClick = (event: ICalendarLayersProps) => {
    const evaluationContext = {
      ...points,
      selectedRow: event,
      event,
    };

    executeAction({
      actionConfiguration: event.onDblClick,
      argumentsEvaluationContext: evaluationContext,
    });
  };

  return (
    <>
      {displayPeriod?.length ? 
      <>
      <div
        style={{
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'right',
          padding: '10px',
        }}
      >
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Views <DownOutlined />
          </a>
        </Dropdown>
      </div>
      <Calendar
        views={displayPeriod as any}
        onView={(view) => {
            updateDefaultCalendarView(view);
            setDefaultView(view);
        }}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        view={displayPeriod?.includes(defaultView) ? defaultView : displayPeriod?.[0]}
        events={points}
        style={{ height: height ? addPx(height.toString()) : "100vh", width: width ? addPx(width.toString()) : "100%" }}
        onSelectEvent={handleCustomSelect}
        onDoubleClickEvent={handleCustomDoubleClick}
        eventPropGetter={(event: any) => ({
          style: { backgroundColor: event.color }
        })}
      />
      </>
      :
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Selected Calendar Views!'} />}
    </> 
  );
};

export default CalendarControl;
