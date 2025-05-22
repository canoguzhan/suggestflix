import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, Film, Heart, Mail, Info } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Home', href: '/', icon: Home, description: 'Back to homepage' },
    { name: 'Discover Movies', href: '/', icon: Film, description: 'Find your next favorite movie' },
    { name: 'Favorites', href: '/favorites', icon: Heart, description: 'View your saved movies' },
    { name: 'About', href: '/about', icon: Info, description: 'Learn more about SuggestFlix' },
    { name: 'Contact', href: '/contact', icon: Mail, description: 'Get in touch with us' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-white mb-4">Oops! Page Not Found</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Don't worry! While this page might be lost in the movie universe, we've got plenty of other great content for you to explore.
          </p>
          
          {/* Search Suggestion */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center">
              <Search className="w-6 h-6 mr-2" />
              Looking for something specific?
            </h3>
            <p className="text-gray-300 mb-4">
              Try searching for movies on our homepage or check out these popular destinations:
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              Go to Homepage
            </Button>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 h-full hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    <link.icon className="w-6 h-6 text-white mr-2" />
                    <h3 className="text-xl font-semibold text-white">{link.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{link.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 bg-white/5 backdrop-blur-lg rounded-lg p-6 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              If you believe this is a technical issue or you need assistance, please don't hesitate to contact us.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/20"
              >
                Contact Support
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage; 