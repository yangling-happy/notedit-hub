import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Segmented,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/authContext";
import { loginApi, registerApi } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  confirmPassword?: string;
}

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const payload = {
        username: values.username,
        password: values.password,
      };

      const res =
        mode === "login" ? await loginApi(payload) : await registerApi(payload);

      login(res.data.token, res.data.user);
      message.success(mode === "login" ? "登录成功" : "注册成功，已自动登录");
      navigate("/wiki", { replace: true });
    } catch (err: any) {
      message.error(
        err.response?.data?.message ||
          (mode === "login" ? "登录失败，请检查凭据" : "注册失败，请稍后再试"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        style={{
          width: 360,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 400, letterSpacing: "1px" }}
          >
            NOTEDIT
          </Title>
          <Typography.Text type="secondary">请登录您的账号</Typography.Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Segmented
            block
            value={mode}
            onChange={(value) => {
              setMode(value as "login" | "register");
              form.resetFields(["password", "confirmPassword"]);
            }}
            options={[
              { label: "登录", value: "login" },
              { label: "注册", value: "register" },
            ]}
          />
        </div>

        <Form
          form={form}
          name="auth"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              ...(mode === "register"
                ? [{ min: 6, message: "密码至少 6 个字符" }]
                : []),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="密码"
            />
          </Form.Item>

          {mode === "register" && (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请再次输入密码" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="确认密码"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: "#000", borderColor: "#000" }} // 强制黑白风格
            >
              {mode === "login" ? "登录" : "注册并登录"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
