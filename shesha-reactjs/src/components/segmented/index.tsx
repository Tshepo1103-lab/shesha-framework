import React from 'react';
import { ISegmentedProps } from './model';
import { Avatar, Segmented } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const data = [
    {
        id: 1,
        name: 'User 1',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8',
    },
    {
        id: 2,
        name: 'User 2',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=10',
    },
    {
        id: 3,
        name: 'User 3',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=12',
    }
];

export const SegmentedReactComponent: React.FC<ISegmentedProps> = () => {
    return (
        <Segmented
            options={data.map((item) => ({
                label: (
                    <div style={{ padding: 4 }}>
                        <Avatar src={item.avatar} icon={!item.avatar && <UserOutlined />} />
                        <div>{item.name}</div>
                    </div>
                ),
                value: item.id,
            }))}
        />
    );
};
