import React from "react";
import { Film, Moon, Sun, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/lib/localization";
import { Link } from "wouter";

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-secondary text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:text-primary transition-colors">
              <Film className="text-primary text-2xl mr-2" />
              <h1 className="text-xl md:text-2xl font-bold">SuggestFlix</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/favorites"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden md:inline">Favorites</span>
            </Link>
            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded uppercase">
              {language}
            </span>
            {themeButton}
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-auto bg-secondary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </p>
            <p className="text-sm text-gray-400">
              {t('footer.poweredBy')}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="mailto:contact@example.com" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
