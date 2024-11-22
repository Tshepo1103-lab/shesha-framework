import { Alert } from 'antd';
import React, { FC, ReactNode } from 'react';
import { useStyles } from './styles/styles';
import { useRefListItemGroupConfigurator } from '../provider';
import RefListItemProperties from './properties';

export interface IRefListItemGroupConfiguratorProps {
  render?: ReactNode | (() => ReactNode);
  heading?: ReactNode | (() => ReactNode);
  type?: string;
  datasource?: string;
}

export const RefListItemGroupConfigurator: FC<IRefListItemGroupConfiguratorProps> = (props) => {
  const { styles } = useStyles();
  const { readOnly } = useRefListItemGroupConfigurator();

  return (
    <div className={styles.shaToolbarConfigurator}>
      <Alert
        message={readOnly ? 'Here you can view your component configurations.' : 'Here you can configure the component step configurations.'}
        className={styles.shaToolbarConfiguratorAlert}
      />
      <RefListItemProperties type={props.type} datasource={props.datasource} />
    </div>
  );
};

export default RefListItemGroupConfigurator;
