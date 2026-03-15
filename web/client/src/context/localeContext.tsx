import { createContext } from "react";
export const LocaleContext = createContext({
  lang: "zh",
  setLang: (_: string) => {},
});
