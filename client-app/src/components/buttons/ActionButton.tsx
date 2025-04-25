import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";

type ActionButtonProps = {
  onEdit: () => void;
  onDelete: () => void;
  additionalItems?: MenuProps['items'];
};

const ActionButton: React.FC<ActionButtonProps> = ({ onEdit, onDelete, additionalItems }) => {
  const items: MenuProps['items'] = [
    { key: "edit", label: 'Edit', icon: <EditOutlined />, onClick: onEdit },
    { key: "delete", label: 'Delete', icon: <DeleteOutlined />, onClick: onDelete }
  ];

  if (additionalItems) {
    items.push(...additionalItems);
  }

  return (
    <Dropdown menu={{ items }} placement="bottom" arrow>
      <Button size="small" type="link" icon={<EllipsisOutlined />} />
    </Dropdown>

  )
};

export default ActionButton;
