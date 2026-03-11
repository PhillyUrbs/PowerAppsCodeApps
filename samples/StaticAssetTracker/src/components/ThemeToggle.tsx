import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="win-titlebar-btn"
      style={{ width: 24, height: 24 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-3 w-3 block dark:hidden" />
      <Moon className="h-3 w-3 hidden dark:block" />
    </button>
  );
}
