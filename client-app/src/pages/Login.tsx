import { Form, Input, Button, message, FormProps } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import { AxiosErrorResponseType } from "../types";
import { axiosInstance } from "../lib/api";
import { useNavigate } from "react-router";

type LoginValues = {
  email?: string;
  password?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const onFinish: FormProps<LoginValues>['onFinish'] = async (values) => {
    console.log("Success:", values);
    try {
      await axiosInstance.post("/login", values);
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError;
      const axiosErrorResponse = axiosError.response
        ?.data as AxiosErrorResponseType;

      message.error(axiosErrorResponse.message ?? axiosError.message);
    }
  };

  const onFinishFailed: FormProps<LoginValues>['onFinishFailed'] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <h1 className="mb-8">Login</h1>
      <Form
        style={{ width: 300 }}
        variant="filled"
        size="large"
        layout="vertical"
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item className="mt-10">
          <Button
            block
            htmlType="submit"
            style={{ backgroundColor: '#0C74B6', color: 'white', border: 'none' }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};