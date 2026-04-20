import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { NoteditWordmark } from "./NoteditWordmark";
import "./marketing.css";
import "./session-loading.css";

/**
 * Full-screen session / i18n bootstrap screen (Vercel-inspired: logo fade + progress).
 */
export function SessionLoading() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`session-loading-root ${isDark ? "session-loading-root--dark" : ""}`}
    >
      <div className="session-loading-topbar" aria-hidden>
        <div className="session-loading-topbar-inner" />
      </div>
      <motion.div
        className="session-loading-center"
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="session-loading-logo marketing-logo-mark">
          <NoteditWordmark />
        </div>
      </motion.div>
      <div className="session-loading-track" aria-hidden>
        <div className="session-loading-fill" />
      </div>
    </div>
  );
}
