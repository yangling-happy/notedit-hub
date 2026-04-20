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
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { loginApi, registerApi } from "../../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { MarketingShell } from "../marketing/MarketingShell";
import { usePrefersReducedMotion } from "../marketing/usePrefersReducedMotion";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  confirmPassword?: string;
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
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
    } catch (err: unknown) {
      const serverMsg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined;
      message.error(
        serverMsg ||
          (mode === "login"
            ? t("auth.login_failed_check_credentials")
            : t("auth.register_failed_try_later")),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingShell variant="auth">
      <div className="marketing-auth-panel">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 360,
              margin: "0 auto",
              borderRadius: 16,
              border: "1px solid var(--marketing-border, rgba(0,0,0,0.06))",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              background: "var(--marketing-card-bg, rgba(255,255,255,0.72))",
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
        </motion.div>
      </div>
    </MarketingShell>
  );
};
