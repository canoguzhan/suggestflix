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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/suggestflix" className="text-gray-400 hover:text-white transition-colors">
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
                <a href="https://twitter.com/suggestflix" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                {t('footer.copyright').replace('{year}', currentYear.toString())}
              </p>
              <p className="text-sm text-gray-400">
                {t('footer.poweredBy')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
