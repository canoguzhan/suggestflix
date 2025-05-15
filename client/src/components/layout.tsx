import React from "react";
import { Film, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/lib/localization";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  // Create the icon element based on the current theme
  const themeIcon = theme === "dark" 
    ? React.createElement(Sun, { className: "h-5 w-5" })
    : React.createElement(Moon, { className: "h-5 w-5" });

  // Create the button for toggling theme
  const themeButton = React.createElement(
    Button,
    { 
      variant: "ghost", 
      size: "icon", 
      onClick: toggleTheme, 
      className: "text-white" 
    },
    themeIcon
  );

  const currentYear = new Date().getFullYear();

  return React.createElement(
    "div",
    { className: "min-h-screen flex flex-col" },
    // Header section
    React.createElement(
      "header",
      { className: "bg-secondary text-white py-4 shadow-md" },
      React.createElement(
        "div",
        { className: "container mx-auto px-4 flex justify-between items-center" },
        React.createElement(
          "div",
          { className: "flex items-center" },
          React.createElement(Film, { className: "text-primary text-2xl mr-2" }),
          React.createElement(
            "h1",
            { className: "text-xl md:text-2xl font-bold" },
            "SuggestFlix"
          )
        ),
        React.createElement(
          "nav", 
          { className: "flex items-center gap-2" },
          React.createElement(
            "span",
            { className: "text-xs bg-gray-700 text-white px-2 py-1 rounded uppercase" },
            language
          ),
          themeButton
        )
      )
    ),
    // Main content
    children,
    // Footer section
    React.createElement(
      "footer",
      { className: "bg-secondary text-white py-6 mt-auto" },
      React.createElement(
        "div",
        { className: "container mx-auto px-4" },
        React.createElement(
          "div",
          { className: "flex flex-col md:flex-row justify-between items-center" },
          React.createElement(
            "div",
            { className: "mb-4 md:mb-0" },
            React.createElement(
              "p", 
              null, 
              t('footer.copyright', { year: currentYear })
            ),
            React.createElement(
              "p",
              { className: "text-sm text-gray-400" },
              t('footer.poweredBy')
            )
          ),
          React.createElement(
            "div",
            { className: "flex space-x-4" },
            // Links with icons
            React.createElement(
              "a",
              { href: "https://github.com", className: "text-gray-400 hover:text-white" },
              React.createElement(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-5 w-5"
                },
                React.createElement("path", {
                  d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                })
              )
            ),
            React.createElement(
              "a",
              { href: "https://twitter.com", className: "text-gray-400 hover:text-white" },
              React.createElement(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-5 w-5"
                },
                React.createElement("path", {
                  d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                })
              )
            ),
            React.createElement(
              "a",
              { href: "mailto:contact@example.com", className: "text-gray-400 hover:text-white" },
              React.createElement(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-5 w-5"
                },
                React.createElement("path", {
                  d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                }),
                React.createElement("polyline", { points: "22,6 12,13 2,6" })
              )
            )
          )
        )
      )
    )
  );
}
