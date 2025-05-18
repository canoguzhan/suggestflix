import React from "react";
import { Film, Moon, Sun, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/lib/localization";
import { Link } from "wouter";
import LanguageSelector from "@/components/language-selector";
import { trackThemeToggle } from "@/lib/analytics";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
    trackThemeToggle(theme === 'dark' ? 'light' : 'dark');
  };

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
      onClick: handleThemeToggle, 
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
            <LanguageSelector />
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
              <a href="https://instagram.com/suggestflix" className="text-gray-400 hover:text-white">
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
