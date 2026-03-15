import { Segmented } from "antd";
import { useTranslation } from "react-i18next";
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLangChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Segmented
      value={i18n.language}
      onChange={handleLangChange}
      options={[
        { label: "中", value: "zh" },
        { label: "En", value: "en" },
      ]}
    />
  );
};
