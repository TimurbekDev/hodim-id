import React from 'react';
import { Avatar, Typography } from 'antd';

interface HeaderProps {
  avatarSrc?: string;
  avatarRightSrc?: string;
  name?: string;
  branch?: string;
}

const Header: React.FC<HeaderProps> = ({ avatarSrc, avatarRightSrc, name, branch }) => {
  return (
    <div className="flex h-[56px] w-full items-center justify-between">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Avatar size={{ xs: 36, sm: 44 }} src={avatarSrc} />
        <div className="flex flex-col">
          <Typography.Text className="text-[12px]! font-semibold sm:text-base">{name}</Typography.Text>
          <Typography.Text className="text-[10px]! text-gray-500! sm:text-sm">{branch}</Typography.Text>
        </div>
      </div>

      {avatarRightSrc && (
        <Avatar size={{ xs: 33, sm: 38 }} src={avatarRightSrc} />
      )}
    </div>
  );
};

export default Header;
