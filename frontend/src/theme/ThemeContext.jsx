import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;

      // Detecta si la máquina está en modo oscuro
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  });

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  // EFECTO 1: Aplica o remueve la clase "dark" en el HTML de forma segura
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // EFECTO 2: Escucha cambios en el sistema operativo en tiempo real
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Si el sistema cambia, alineamos la app automáticamente y actualizamos el almacenamiento
      const nextTheme = e.matches ? "dark" : "light";
      setTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}