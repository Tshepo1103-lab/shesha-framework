import React, { useCallback, useEffect, useState } from 'react';
import { ISegmentedProps } from './model';
import { Flex, Segmented } from 'antd';
import IconPicker from '../iconPicker';
import { useConfigurableActionDispatcher } from '@/providers';
import { useAvailableConstantsData } from '@/utils/publicUtils';
import { useSegmentedActions } from './utils';
import { useRefListItemGroupConfigurator } from '@/providers/refList/provider';

export const SegmentedReactComponent: React.FC<ISegmentedProps> = (props) => {
  const { executeAction } = useConfigurableActionDispatcher();
  const allData = useAvailableConstantsData();
  const { fetchUserSettings, updateUserSettings } = useSegmentedActions();
  const { componentName } = props;
  const {items} = useRefListItemGroupConfigurator()

  console.log('items', items);
  // Initialize state as null to indicate "not yet loaded"
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  useEffect(() => {
    // Fetch and set the initial value from settings
    fetchUserSettings(componentName).then((response) => {
      if (!response?.result) return;
      
      // Validate if the current selectedValue is still in the new items list
      const validSelectedValue = items.some(item => item.id === selectedValue);
      
      // If not valid, fallback to first item or saved value
      setSelectedValue(validSelectedValue ? selectedValue : (response.result || items[0].id));
    });
  }, [componentName, items]); // Add items to dependency array

  const onChangeInternal = useCallback(
    (value: any): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const item = items.find((item: any) => item.id === value);

        if (!item?.actionConfiguration?.actionName) {
          resolve(true);
          return;
        }

        if (selectedValue === value) {
          resolve(true);
          return;
        }

        const evaluationContext = {
          ...allData,
          selectedValue: value,
          item,
        };

        executeAction({
          actionConfiguration: item?.actionConfiguration,
          argumentsEvaluationContext: evaluationContext,
          success: () => {
            resolve(true);
          },
          fail: (error) => {
            console.error('Action failed:', error);
            reject();
          },
        });
      });
    },
    [allData, executeAction, items]
  );

  // Don't render until we have the initial value
  if (selectedValue === null) {
    return null; // Or a loading indicator if preferred
  }

  return (
    <Segmented
      key={componentName}
      defaultValue={selectedValue}
      value={selectedValue}
      onChange={(value) => {
        onChangeInternal(value)
          .then((canUpdate) => {
            if (canUpdate) {
              setSelectedValue(value); 
              updateUserSettings(value, componentName);
            }
          })
          .catch(() => {
            setSelectedValue(selectedValue);
            console.error('Failed to update settings');
          });
      }}
      size="large"
      options={items.map((item: any) => ({
        label: (
          <Flex style={{ padding: 5 }}>
            <IconPicker readOnly value={item.icon || 'StopOutlined'} />
            <div>{item.item}</div>
          </Flex>
        ),
        value: item.id,
      }))}
    />
  );
};
