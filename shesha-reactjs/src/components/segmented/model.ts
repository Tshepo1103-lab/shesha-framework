import { IConfigurableFormComponent } from "@/providers";
 
export interface ISegmentedProps extends IConfigurableFormComponent { 
    datasource?: string;
    values?: any;
    referenceList?: any;
    componentName?: string;
    block?: boolean;
    showIcons?: boolean;
    showLabel?: boolean;
    items?: any;


}