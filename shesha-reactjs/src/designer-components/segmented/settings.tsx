
import { Autocomplete, LabelValueEditor, Show } from '@/components';
import RefListItemSelectorSettingsModal from '@/providers/refList/options/modal';
import { Checkbox, Input } from 'antd';
import React, { FC } from 'react';
import SettingsForm, { useSettingsForm } from '../_settings/settingsForm';
import { ISettingsFormFactoryArgs } from '@/interfaces';
import SettingsFormItem from '../_settings/settingsFormItem';
import SettingsCollapsiblePanel from '../_settings/settingsCollapsiblePanel';
import { Dropdown } from '@/components/dropdown/dropdown';
import { nanoid } from 'nanoid';
import { ISegmentedProps } from '@/components/segmented/model';

interface ISegmentedSettingsState extends ISegmentedProps {}

const SegmentedSettings: FC<ISettingsFormFactoryArgs<ISegmentedProps>> = (props) => {
  const { values } = useSettingsForm<ISegmentedProps>();
  const { readOnly } = props;

  return (
    <>
      <SettingsCollapsiblePanel header="Display">
        <SettingsFormItem name="componentName" label="Component Name" required>
          <Input readOnly={readOnly} />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>
      <SettingsCollapsiblePanel header="Options">
        <SettingsFormItem name="datasource" label="Datasource Type" jsSetting>
          <Dropdown
            dataSourceType="values"
            values={[
              { id: nanoid(), value: 'values', label: 'Values' },
              { id: nanoid(), value: 'referenceList', label: 'Reference List' },
            ]}
          />
        </SettingsFormItem>
        <Show when={values.datasource === 'referenceList'}>
        <SettingsFormItem
          name="referenceList"
          label="Reference List"
          style={{ width: '100%' }}
          tooltip="Make sure to reselect the reference list if any changes are made to its items"
        >
          <Autocomplete
            dataSourceType="entitiesList"
            typeShortAlias="Shesha.Framework.ReferenceList"
            filter='{"and":[{"==":[{"var":"isLast"},true]}]}'
            readOnly={values.readOnly}
          />
        </SettingsFormItem>
        </Show>
        <SettingsFormItem name="items">
          <RefListItemSelectorSettingsModal referenceList={values.referenceList} readOnly={values.readOnly}/>
        </SettingsFormItem>
      </SettingsCollapsiblePanel>

      <SettingsFormItem name="showLabel" label="Show Label" valuePropName="checked" jsSetting>
        <Checkbox disabled={values.readOnly} />
      </SettingsFormItem>
      <SettingsFormItem name="showIcons" label="Show Icon" valuePropName="checked" jsSetting>
        <Checkbox disabled={values.readOnly} />
      </SettingsFormItem>
      <SettingsFormItem name="block" label="Block" valuePropName="checked" jsSetting>
        <Checkbox disabled={values.readOnly} />
      </SettingsFormItem>
    </>
  );
};

export const SegmentedSettingsForm: FC<ISettingsFormFactoryArgs<ISegmentedProps>> = (props) => {
  return SettingsForm<ISegmentedSettingsState>({ ...props, children: <SegmentedSettings {...props} /> });
};
