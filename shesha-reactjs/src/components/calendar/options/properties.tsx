import { Empty, Form } from 'antd';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import itemSettingsJson from './layerSettings.json';
import { useLayerGroupConfigurator } from '@/providers/calendar';
import { getComponentModel } from '@/providers/calendar/utils';
import { ConfigurableForm } from '@/components/configurableForm';
import { ConfigurableFormInstance, FormMarkup } from '@/index';

export interface ILayerPropertiesProps {}

export const LayerProperties: FC<ILayerPropertiesProps> = () => {
  const { selectedItemId, getItem, updateItem, readOnly } = useLayerGroupConfigurator();
  // note: we have to memoize the editor to prevent unneeded re-rendering and loosing of the focus
  const [editor, setEditor] = useState<ReactNode>(<></>);
  const [form] = Form.useForm();

  const formRef = useRef<ConfigurableFormInstance>(null);

  const debouncedSave = useDebouncedCallback(
    (values) => {
      updateItem({ id: selectedItemId, settings: values });
    },
    // delay in ms
    300,
  );

  useEffect(() => {
    form.resetFields();

    if (formRef.current) {
      const values = form.getFieldsValue();

      formRef.current.setFormData({ values, mergeValues: false });
    }
  }, [selectedItemId]);

  const getEditor = () => {
    if (!selectedItemId) return null;

    const componentModel = getComponentModel(getItem(selectedItemId));

    const markup = itemSettingsJson as FormMarkup;

    return (
      <ConfigurableForm
        formRef={formRef}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        mode={readOnly ? 'readonly' : 'edit'}
        markup={markup}
        form={form}
        initialValues={componentModel}
        onValuesChange={debouncedSave}
      />
    );
  };

  useEffect(() => {
    setEditor(getEditor());
  }, [selectedItemId]);

  if (!Boolean(selectedItemId)) {
    return (
      <div>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            readOnly ? 'Please select a component to view properties' : 'Please select a component to begin editing'
          }
        />
      </div>
    );
  }

  return <>{editor}</>;
};

export default LayerProperties;
