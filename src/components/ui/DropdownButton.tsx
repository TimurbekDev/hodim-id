import { Dropdown, Button, type MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface DropdownButtonProps{
    title?: string;
    items?: MenuProps['items'];
    onItemClick?: (key:string) => void;
    className?: string;
    width?: string | number;
    height?: string | number;
}

const defaultMenuItems: MenuProps['items'] = [
    { key: '1', label: 'profile'},
    { key: '2', label: "something"},
    { type: 'divider'}
];

const DropdownButton: React.FC<DropdownButtonProps> = ({
    title = 'Actions',
    items = defaultMenuItems,
    onItemClick,
    className = '', 
    width = '100%',
    height = '100%'
    }) => {
        const handleMenuClick: MenuProps['onClick'] = (e) => 
            {onItemClick?.(e.key);
  };

     return (
     <Dropdown menu={{ items, onClick: handleMenuClick }}>
        <Button className={className}
        style={{width, height}}
        >
            {title} <DownOutlined />
        </Button>
      </Dropdown>
  );
};


export default DropdownButton;