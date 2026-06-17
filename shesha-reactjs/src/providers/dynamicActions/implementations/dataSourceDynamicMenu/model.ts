import { IConfigurableActionConfiguration } from "@/interfaces/configurableAction";

export interface IWorkflowInstanceStartActionsProps { }

export interface IDataSourceArguments {
    dataSourceUrl?: any;
    queryParams?: any;
    actionConfiguration?: IConfigurableActionConfiguration;
    filter?: string;
    entityTypeShortAlias?: string;
    labelProperty?: string;
    tooltipProperty?: string;
    maxResultCount?: number;
    buttonType?: string;
    /** Property used to group menu items into sub-menus */
    groupingProperty?: string;
    /** Property used to sort the fetched items */
    sortBy?: string;
    /** Sort direction for the fetched items */
    sortOrder?: 'asc' | 'desc';
}
