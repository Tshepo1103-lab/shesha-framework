import { CALENDAR_ACTIONS_OWNER, CALENDAR_CONFIGURABLE_ACTIONS } from "./model";
import { useMetaMapMarker } from "../hooks";
import { useConfigurableAction } from "@/providers";
import { ICalendarLayersProps } from "@/providers/calendar/models";

export const useRefreshCalendarAction = (items: ICalendarLayersProps[]) => {
    const { fetchData } = useMetaMapMarker(items);

    useConfigurableAction({
        owner: CALENDAR_ACTIONS_OWNER,
        ownerUid: CALENDAR_ACTIONS_OWNER,
        name: CALENDAR_CONFIGURABLE_ACTIONS.REFRESH,
        hasArguments: false,
        executer: () => {
            fetchData();
            return Promise.resolve();
        }
    }, []);
};