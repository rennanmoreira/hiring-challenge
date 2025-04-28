"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Button, Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}: LoginModalProps) => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Login Required"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ username: "admin", password: "test1234" }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default LoginModal;
