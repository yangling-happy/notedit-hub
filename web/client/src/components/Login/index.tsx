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
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  confirmPassword?: string;
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form] = Form.useForm<LoginFormValues>();

  const state = location.state as { from?: string } | null;
  const redirectTo =
    state?.from && state.from.startsWith("/") ? state.from : "/wiki";

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
      message.success(
        mode === "login"
          ? t("auth.login_success")
          : t("auth.register_success_auto_login"),
      );
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      message.error(
        err.response?.data?.message ||
          (mode === "login"
            ? t("auth.login_failed_check_credentials")
            : t("auth.register_failed_try_later")),
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
          <Typography.Text type="secondary">
            {t("auth.login_prompt")}
          </Typography.Text>
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
              { label: t("auth.mode_login"), value: "login" },
              { label: t("auth.mode_register"), value: "register" },
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
            rules={[
              { required: true, message: t("auth.validation_enter_username") },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("auth.username_placeholder")}
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("auth.validation_enter_password") },
              ...(mode === "register"
                ? [{ min: 6, message: t("auth.validation_password_min") }]
                : []),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("auth.password_placeholder")}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </Form.Item>

          {mode === "register" && (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: t("auth.validation_confirm_password"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("auth.validation_password_mismatch")),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder={t("auth.confirm_password_placeholder")}
                autoComplete="new-password"
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
              {mode === "login"
                ? t("auth.submit_login")
                : t("auth.submit_register_and_login")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
