import { useTheme } from "next-themes";
import { ConfigProvider, theme } from "antd";

export function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const algorithm =
    resolvedTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return <ConfigProvider theme={{ algorithm }}>{children}</ConfigProvider>;
}
