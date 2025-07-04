import React, { FC, PropsWithChildren } from "react";
import { useRefreshCalendarAction } from "./refresh-calendar";
import { ICalendarLayersProps } from "../provider/models";

export const CalendarActionsAccessor: FC<PropsWithChildren<{items: ICalendarLayersProps[]}>> = ({ children, items }) => {
    useRefreshCalendarAction(items);

    return (
        <>{children}</>
    );
};