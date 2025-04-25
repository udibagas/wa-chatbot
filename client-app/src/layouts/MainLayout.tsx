import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import AppMenu from '../components/AppMenu';
import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} theme='light'>
        <div className="w-3/4 p-2 bg-blue-500 m-auto my-4 text-center text-white font-bold text-lg rounded">
          Lapor!
        </div>
        <AppMenu />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </Content>
      </Layout>
    </Layout>
  )
}