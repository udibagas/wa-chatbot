import { useEffect, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import { BellDotIcon, LayoutDashboardIcon, MessageCircleMoreIcon, User } from 'lucide-react';
import { Link } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    type: 'group',
    key: "main-menu",
    label: "",
    children: [
      {
        label: <Link to="/">Dashboard</Link>,
        key: "/",
        icon: <LayoutDashboardIcon />,
      },
      {
        label: <Link to="/messages">Messages</Link>,
        key: "/messages",
        icon: <MessageCircleMoreIcon />,
      },
      {
        label: <Link to="/notifications">Notification</Link>,
        key: "/notifications",
        icon: <BellDotIcon />,
      },
      {
        label: <Link to="/users">Users</Link>,
        key: "/users",
        icon: <User />,
      },
    ],
  },
];

export default function AppSideBar() {
  const pathname = window.location.pathname
  const [selectedKey, setSelectedKeys] = useState(pathname);

  useEffect(() => {
    setSelectedKeys(window.location.pathname);
  }, [pathname]);

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      items={menuItems}
    />
  );
};
