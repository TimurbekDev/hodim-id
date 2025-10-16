import React from 'react';
import { Avatar, Typography } from 'antd';
import SelectDownIcon from '../../assets/select_down.svg';
import { usePopups } from '../../store/usePopups';
import { Popups } from '../../utils/popups';

interface HeaderProps {
  avatarSrc?: string;
  avatarRightSrc?: string;
  name?: string;
  branch?: string;
}

const Header: React.FC<HeaderProps> = ({ avatarSrc, avatarRightSrc, name, branch }) => {

  const { setActivePopup } = usePopups()

  return (
    <div className="flex h-[56px] w-full items-center justify-between">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Avatar size={{ xs: 36, sm: 44 }} src={avatarSrc} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2" onClick={() => setActivePopup({ popup: Popups.POPUP_ORG_SELECT })}>
            <Typography.Text className="text-[12px]! font-semibold sm:text-base">{name}</Typography.Text>
            <img src={SelectDownIcon} alt="select" className="h-3 w-3" />
          </div>
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
