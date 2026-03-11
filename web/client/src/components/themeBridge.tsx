import { useTheme } from "next-themes";
import { ConfigProvider, theme } from "antd";

export function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  // 逻辑：如果 resolvedTheme 是 'dark'，就用 darkAlgorithm，否则用 defaultAlgorithm
  const algorithm =
    resolvedTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return <ConfigProvider theme={{ algorithm }}>{children}</ConfigProvider>;
}
