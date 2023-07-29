import { createContext, useState, useEffect, ReactNode } from "react";
import {
  MAIN_LIGHT_CSS,
  MAIN_DARK_CSS,
  MD_LIGHT_CSS,
  MD_DARK_CSS,
} from "./Constants";

type ContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const Context = createContext<ContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

type ContextProviderProps = {
  children: ReactNode;
};

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const storedDarkMode = localStorage.getItem("isDarkMode");
  const initialDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;

  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  const toggleTheme = () => {
    setIsDarkMode((prevIsDarkMode: boolean) => !prevIsDarkMode);
  };

  const createCSSLink = (id: string, href: string): HTMLLinkElement => {
    let link = document.getElementById(id) as HTMLLinkElement;

    if (link) document.head.removeChild(link);

    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);

    return link;
  };

  useEffect(() => {
    const link1 = createCSSLink(
      "main-darkmode",
      isDarkMode ? MAIN_DARK_CSS : MAIN_LIGHT_CSS
    );

    const link2 = createCSSLink(
      "md-darkmode",
      isDarkMode ? MD_DARK_CSS : MD_LIGHT_CSS
    );

    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, [isDarkMode]);

  const contextValue: ContextType = {
    isDarkMode,
    toggleTheme,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
