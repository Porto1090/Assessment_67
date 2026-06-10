import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(current =>
      current === "light" ? "dark" : "light"
    );
  };

  useEffect(() => {
    console.log("Theme changed:", theme);

    if (theme === "dark") {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = "";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}