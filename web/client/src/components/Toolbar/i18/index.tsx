import { Segmented } from "antd";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language?.startsWith("en") ? "en" : "zh";

  const handleLangChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Segmented
      value={currentLang}
      onChange={handleLangChange}
      options={[
        { label: t("language.zh_short"), value: "zh" },
        { label: t("language.en_short"), value: "en" },
      ]}
    />
  );
};
