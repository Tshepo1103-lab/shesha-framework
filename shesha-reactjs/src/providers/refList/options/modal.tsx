import { Button, Divider, Modal } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import RefListItemGroupConfigurator from './configurator';
import RefListItemsContainer from './refListItemsContainer';
import { useStyles } from './styles/styles';
import { IRefListItemFormModel } from '../provider/models';
import { RefListItemGroupConfiguratorProvider, useRefListItemGroupConfigurator } from '../provider';

interface IFiltersListProps {
  items?: IRefListItemFormModel[];
  showModal?: () => void;
  readOnly?: boolean;
  values?: any;
  datasource?: string;
}

export const RefListItemsListInner: FC<Omit<IFiltersListProps, 'items'>> = ({ showModal, readOnly = false, values,datasource }) => {
  const { styles } = useStyles();
  const { items, selectItem, addLayer: addButton } = useRefListItemGroupConfigurator();

  const onConfigClick = (localSelectedId: string) => {
    selectItem(localSelectedId);

    showModal();
  };

  return (
    <div className={styles.shaToolbarConfigurator}>
      <RefListItemsContainer  items={items} values={values} datasource={datasource} index={[]} onConfigClick={onConfigClick} readOnly={readOnly} />
      {(!readOnly  && datasource === 'values') && (
        <>
          <Divider />
          <Button onClick={addButton} size="large" type="primary" block={true}>
            Add Value
          </Button>
        </>
      )}
    </div>
  );
};

export interface ITableViewSelectorSettingsModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
  readOnly: boolean;
  referenceList?: any;
  type?: string;
  values?: any;
  datasource?: string;  
}

export const TableViewSelectorSettingsModalInner: FC<ITableViewSelectorSettingsModal> = ({
  visible,
  onChange,
  hideModal,
  type,
  datasource
}) => {
  const { items, readOnly } = useRefListItemGroupConfigurator();

  useDeepCompareEffect(() => {
    if(items?.length){
      onChange(items);
    }
  }, [items]);
 
  const updateFilters = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal
      width="40%"
      open={visible}
      title={readOnly ? 'View RefList Item' : 'Configure RefList Item'}
      onCancel={hideModal}
      cancelText={readOnly ? 'Close' : undefined}
      okText="Save"
      onOk={updateFilters}
      okButtonProps={{ hidden: readOnly }}
    >
      <RefListItemGroupConfigurator type={type} datasource={datasource} />
    </Modal>
  );
};

export const RefListItemSelectorSettingsModal: FC<Omit<ITableViewSelectorSettingsModal, 'visible' | 'hideModal'>> = (
  props,
) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);

  const hideModal = () => setModalVisible(false);

  const items = (props.value as IRefListItemFormModel[]) || [];

  return (
    <RefListItemGroupConfiguratorProvider referenceList={props.referenceList} items={items} readOnly={props.readOnly} values={props.values} datasource={props.datasource}>
      <RefListItemsListInner showModal={showModal} readOnly={props.readOnly} datasource={props.datasource} values={props.values}/>

      <TableViewSelectorSettingsModalInner {...props} visible={modalVisible} hideModal={hideModal} type={props.type} datasource={props.datasource}/>
    </RefListItemGroupConfiguratorProvider>
  );
};

export default RefListItemSelectorSettingsModal;
