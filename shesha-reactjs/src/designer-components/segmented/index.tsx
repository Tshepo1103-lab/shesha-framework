import { MenuOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import { ConfigurableFormItem } from '@/components';
import { IToolboxComponent } from '@/index';
import { ISegmentedProps } from '@/components/segmented/model';
import { SegmentedReactComponent } from '@/components/segmented';
import { SegmentedSettingsForm } from './settings';
import { RefListItemGroupConfiguratorProvider } from '@/providers/refList/provider';

const SegmentedComponent: IToolboxComponent<ISegmentedProps> = {
  type: 'segmentedComponent',
  isInput: false,
  name: 'Segmented Component',
  icon: <MenuOutlined />,
  Factory: ({ model }) => {
    const UseControl = useMemo(() => {
      return (
        <ConfigurableFormItem model={model}>
        {(value) => {
          return (
            <RefListItemGroupConfiguratorProvider
              value={value}
            //   datasource={model.datasource}
            //   values={model.values}
              items={model.items}
              referenceList={model.referenceList}
              readOnly={model.readOnly}
            >
              <SegmentedReactComponent {...model} />
            </RefListItemGroupConfiguratorProvider>
          );
        }}
      </ConfigurableFormItem>
      )
    }, [model.referenceList]);
 
    return (
      UseControl
    );
  },
  initModel: (model) => ({
    ...model,
    hideLabel: true,
  }),
  settingsFormFactory: (props) => {
    return <SegmentedSettingsForm {...props} />;
  },
};

export default SegmentedComponent;