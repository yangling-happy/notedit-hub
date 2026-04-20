import { GithubOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NOTEDIT_GITHUB_URL } from "../../constants/links";
import { LanguageSwitcher } from "../Toolbar/i18";
import { ModeToggle } from "../Toolbar/modeToogle";
import { NoteditWordmark } from "./NoteditWordmark";
import "./marketing.css";

type MarketingShellProps = {
  children: React.ReactNode;
  /** landing: link to login; auth: link back home */
  variant?: "landing" | "auth";
};

export function MarketingShell({
  children,
  variant = "landing",
}: MarketingShellProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`marketing-shell ${isDark ? "marketing-shell--dark" : ""}`}
    >
      <header className="marketing-header">
        <Link to="/" className="marketing-logo marketing-logo-mark">
          <NoteditWordmark />
        </Link>
        <div className="marketing-header-right">
          <div className="marketing-header-tools">
            <LanguageSwitcher size="small" />
            <span className="marketing-tool-wrap">
              <ModeToggle />
            </span>
            <a
              href={NOTEDIT_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="marketing-github"
              title={t("landing.github_aria")}
              aria-label={t("landing.github_aria")}
            >
              <GithubOutlined />
            </a>
          </div>
          <nav className="marketing-header-nav">
            {variant === "landing" ? (
              <Link to="/login" className="marketing-nav-link">
                {t("landing.nav_login")}
              </Link>
            ) : (
              <Link to="/" className="marketing-nav-link">
                {t("landing.back_home")}
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main
        className={
          variant === "auth"
            ? "marketing-main marketing-main--auth"
            : "marketing-main"
        }
      >
        {children}
      </main>
    </div>
  );
}
