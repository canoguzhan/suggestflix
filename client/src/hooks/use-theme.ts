import React from "react";

// Simple theme type
type Theme = "light" | "dark";

// Default theme value for use across the app
const defaultTheme: Theme = "dark";

// Function to get the theme and toggle it
export const useTheme = () => {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  }, [theme]);
  
  // Apply initial theme
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);
  
  return {
    theme,
    toggleTheme
  };
};

// For backwards compatibility, provide a ThemeProvider that doesn't do anything
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};
