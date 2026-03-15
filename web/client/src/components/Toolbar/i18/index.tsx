// import { useContext } from 'react';
// import { LocaleContext } from "../../../context/localeContext" ; // 根据实际路径调整
// import i18n from "../../../locales/i18";
// 根据实际路径调整
import { Segmented } from "antd";
import { useTranslation } from "react-i18next";
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLangChange = (value: string) => {
    // value 此时就是 'en' 或 'zh'
    i18n.changeLanguage(value);
  };

  return (
    <Segmented
      value={i18n.language} // 当前选中的是谁
      onChange={handleLangChange} // 切换时执行逻辑
      options={[
        { label: "中", value: "zh" },
        { label: "En", value: "en" },
      ]}
    />
  );
};
