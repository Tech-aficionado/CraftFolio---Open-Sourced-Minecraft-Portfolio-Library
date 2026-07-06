import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "day" | "night";

type ThemeCtx = {
  theme: Theme;
  isNight: boolean;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "day",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("mc-theme");
      if (saved === "day" || saved === "night") return saved;
    }
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("mc-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "day" ? "night" : "day"));

  return (
    <ThemeContext.Provider
      value={{ theme, isNight: theme === "night", toggle, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
