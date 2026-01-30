"use client";

import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Typography } from "antd";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Item 1",
  },
  {
    key: "2",
    label: "Item 2",
  },
  {
    key: "3",
    label: "Item 3",
  },
];

const App: React.FC = () => (
  <Dropdown
    trigger={["click"]}
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ["3"],
      popupRender: (menu) => <div style={{ borderRadius: 6 }}>{menu}</div>,
    }}>
    <Typography.Link>
      <Space>
        Selectable
        <DownOutlined />
      </Space>
    </Typography.Link>
  </Dropdown>
);

export default App;
