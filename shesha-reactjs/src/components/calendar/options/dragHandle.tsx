import { MoreOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { useLayerGroupConfigurator } from '@/providers/calendar';
import { useStyles } from './styles/styles';

export interface IDragHandleProps {
  id: string;
}

export const DragHandle: FC<IDragHandleProps> = ({ id }) => {
  const { styles } = useStyles();
  const { selectItem } = useLayerGroupConfigurator();
  return (
    <div className={styles.shaToolbarItemDragHandle} onClick={() => selectItem(id)}>
      <MoreOutlined />
    </div>
  );
};

export default DragHandle;
