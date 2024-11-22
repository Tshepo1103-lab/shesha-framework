import { DeleteFilled, EyeInvisibleOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC } from 'react';
import DragHandle from './dragHandle';
import { useStyles } from './styles/styles';
import classNames from 'classnames';
import { IRefListItemFormModel } from '../provider/models';
import { useRefListItemGroupConfigurator } from '../provider';
import ShaIcon, { IconType } from '@/components/shaIcon';

export interface IRefListGroupItemProps extends IRefListItemFormModel {
  index?: number[];
  item?: string;
  id: string;
  onConfigClick?: (selectedItemId: string) => void;
}

export const RefListItem: FC<IRefListGroupItemProps> = (props) => {
  const { styles } = useStyles();
  const { selectedItemId, deleteLayer } = useRefListItemGroupConfigurator();

  const onEditBtnClick = () => {
    if (props.onConfigClick) {
      props.onConfigClick(props.id);
    }
  };

  const onDeleteClick = () => {
    deleteLayer(props.id);
  };


  // console.log('updateItem', updateItem);
  return (
    <div className={classNames(styles.shaToolbarItem, { selected: selectedItemId === props.id })}>
      <div className={classNames(styles.shaToolbarItemHeader)} style={{ display: 'flex', padding: '10px', marginBottom: '5px' }}>
        <DragHandle id={props.id} />
        <span className={styles.shaToolbarItemName}>
          {props.icon && <ShaIcon iconName={props.icon as IconType} />}
          {props.item}
        </span>
        {props.hidden && (
            <EyeInvisibleOutlined style={{ marginRight: '8px', color: '#999' }} />
          )}
        <div className={styles.shaToolbarItemControls}>

          <Button icon={<SettingOutlined />} onClick={onEditBtnClick} size="small" />
          {!props.readOnly && <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />}
        </div>
      </div>
    </div>
  );
};

export default RefListItem;
