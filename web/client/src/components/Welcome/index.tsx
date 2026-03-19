import { useTranslation } from "react-i18next";
import { FileTextOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";

export const Welcome = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const bgColor = isDark ? "rgb(30, 30, 30)" : "rgb(250, 250, 250)";
  const textColor = isDark
    ? "rgba(255, 255, 255, 0.85)"
    : "rgba(0, 0, 0, 0.65)";
  const subtextColor = isDark
    ? "rgba(255, 255, 255, 0.45)"
    : "rgba(0, 0, 0, 0.45)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: bgColor,
        transition: "background-color 0.2s",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 400,
          padding: "32px",
        }}
      >
        <FileTextOutlined
          style={{
            fontSize: 64,
            color: subtextColor,
            marginBottom: 24,
            display: "block",
          }}
        />

        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: textColor,
            margin: "0 0 12px 0",
          }}
        >
          {t("welcome.title")}
        </h1>

        <p
          style={{
            fontSize: 14,
            color: subtextColor,
            margin: "0 0 24px 0",
            lineHeight: 1.6,
          }}
        >
          {t("welcome.subtitle")}
        </p>

        <p
          style={{
            fontSize: 13,
            color: subtextColor,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {t("welcome.hint")}
        </p>
      </div>
    </div>
  );
};
