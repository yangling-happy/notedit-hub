import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { FileEdit, Share2, Download } from "lucide-react";
import { MarketingShell } from "./MarketingShell";
import { HeroScene } from "./HeroScene";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const featureIcons = [FileEdit, Share2, Download] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
} as const;

const revealViewport = {
  once: true,
  margin: "0px 0px -12% 0px" as const,
};

const revealTransition = {
  duration: 0.8,
  ease: [0.21, 0.47, 0.32, 0.98] as const,
};

export function LandingPage() {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();

  const featureGridVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduced ? 0 : 0.11,
          delayChildren: reduced ? 0 : 0.14,
        },
      },
    }),
    [reduced],
  );

  const featureCardVariants = useMemo(
    () => ({
      hidden: {
        opacity: reduced ? 1 : 0,
        y: reduced ? 0 : 26,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduced ? 0 : 0.62,
          ease: [0.21, 0.47, 0.32, 0.98] as const,
        },
      },
    }),
    [reduced],
  );

  const features = [
    { key: "editor" as const, Icon: featureIcons[0] },
    { key: "collab" as const, Icon: featureIcons[1] },
    { key: "export" as const, Icon: featureIcons[2] },
  ];

  return (
    <MarketingShell variant="landing">
      <div className="marketing-page">
        <section className="marketing-hero-section">
          <div className="marketing-hero-grid">
            <div
              className={`marketing-hero-copy ${reduced ? "" : "marketing-hero-copy--rise"}`}
            >
              <h1 className="marketing-hero-title">
                <span className="marketing-hero-brand">NOTEDIT</span>
                <span className="marketing-hero-title-line2">
                  {t("landing.tagline")}
                </span>
              </h1>
              <p className="marketing-hero-subtitle">{t("landing.hero_lead")}</p>
              <div className="marketing-hero-actions">
                <Link to="/login" className="marketing-btn marketing-btn--primary">
                  {t("landing.cta")}
                </Link>
              </div>
            </div>
            <div
              className={`marketing-hero-visual ${reduced ? "" : "marketing-hero-visual--rise"}`}
            >
              <HeroScene />
            </div>
          </div>
        </section>

        <section id="marketing-features" className="marketing-block">
          <div className="marketing-glass marketing-pipeline">
            <motion.div
              className="marketing-pipeline-grid"
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={featureGridVariants}
            >
              {features.map(({ key, Icon }) => (
                <motion.div
                  key={key}
                  className="marketing-pipeline-item"
                  variants={featureCardVariants}
                >
                  <div className="marketing-pipeline-icon">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <div className="marketing-pipeline-label">
                    {t(`landing.feature_${key}_title`)}
                  </div>
                  <p className="marketing-pipeline-desc">
                    {t(`landing.feature_${key}_desc`)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <motion.section
          className="marketing-block marketing-closing"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={revealVariants}
          transition={{ ...revealTransition, delay: 0.1 }}
        >
          <h3 className="marketing-closing-title">{t("landing.closing_title")}</h3>
          <p className="marketing-closing-subtitle">{t("landing.closing_subtitle")}</p>
          <div className="marketing-closing-links">
            <Link to="/login" className="marketing-closing-link marketing-closing-link--emphasis">
              {t("landing.cta")}
            </Link>
          </div>
        </motion.section>
      </div>
    </MarketingShell>
  );
}
