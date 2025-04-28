"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
// Import Ant Design components
import { Button, Layout, Menu, Space } from "antd";
// Import Ant Design icons
import { HomeOutlined } from "@ant-design/icons";
import { AppstoreOutlined } from "@ant-design/icons";
import { ToolOutlined } from "@ant-design/icons";
import { SettingOutlined } from "@ant-design/icons";
import { NodeIndexOutlined } from "@ant-design/icons";
import { LoginOutlined } from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: any;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  // Get the current pathname for menu selection
  const [currentPath, setCurrentPath] = useState("/");
  
  // Update the current path when the component mounts and when the URL changes
  React.useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Set initial path
    updatePath();
    
    // Listen for route changes
    window.addEventListener('popstate', updatePath);
    
    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "/plants",
      icon: <AppstoreOutlined />,
      label: "Plants",
    },
    {
      key: "/areas",
      icon: <AppstoreOutlined />,
      label: "Areas",
    },
    {
      key: "/area-neighbors",
      icon: <NodeIndexOutlined />,
      label: "Neighbors",
    },
    {
      key: "/equipment",
      icon: <ToolOutlined />,
      label: "Equipment",
    },
    {
      key: "/parts",
      icon: <SettingOutlined />,
      label: "Parts",
    },
  ];

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ padding: 0, background: "#073b67", color: "#fff" }}>
          <div
            style={{
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src="/images/logo-opwell.png"
                alt="Opwell Logo"
                style={{ height: "30px", width: "auto" }}
              />
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Asset Management
              </span>
            </div>

            <div>
              {isAuthenticated ? (
                <Space>
                  <span style={{ marginRight: "10px" }}>
                    Welcome, {user?.name}
                  </span>
                  <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </Space>
              ) : (
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => setIsLoginModalVisible(true)}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#073b67" }}>
            <Menu
              mode="inline"
              selectedKeys={[currentPath]}
              style={{ height: "100%", borderRight: 0, background: "#073b67" }}
              items={menuItems}
              onClick={({ key }) => {
                router.push(key);
                setCurrentPath(key); // Update the selected key immediately on click
              }}
              theme="dark"
            />
          </Sider>
          <Layout style={{ padding: 0 }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: "#fff",
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>

      <LoginModal
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onSuccess={() => setIsLoginModalVisible(false)}
      />
    </div>
  );
};

export default MainLayout;
