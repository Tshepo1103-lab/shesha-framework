import { MenuOutlined } from '@ant-design/icons';
import React from 'react';
import { ConfigurableFormItem } from '@/components';
import { IToolboxComponent } from '@/index';
import { getSettings } from './settings';
import { ISegmentedProps } from '@/components/segmented/model';
import { SegmentedReactComponent } from '@/components/segmented';

 
const SegmentedComponent: IToolboxComponent<ISegmentedProps> = {
  type: 'segmentedComponent',
  isInput: false,
  name: 'Segmented Component',
  icon: <MenuOutlined />,
  Factory: ({ model }) => {
    return (
      <div>
        <ConfigurableFormItem model={model}>
          {() => {
            return (
                <SegmentedReactComponent
                {...model}
                />
            );
          }}
        </ConfigurableFormItem>
      </div>
    );
  },
  initModel: (model) => ({
    ...model,
    hideLabel: true,
  }),
  settingsFormMarkup: getSettings(),
};
 
export default SegmentedComponent;