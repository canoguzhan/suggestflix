import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            SuggestFlix is your go-to platform for discovering movies and TV shows tailored to your taste. We leverage the power of the TMDB (The Movie Database) API to bring you up-to-date and comprehensive information about the latest releases, hidden gems, and all-time favorites. Our mission is to make movie discovery fun, easy, and accessible for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-gray-200">
              We believe that everyone deserves a personalized and enjoyable movie night. By utilizing the TMDB API, we provide accurate and rich movie data, helping you find the perfect film or show for any occasion. Whether you're looking for trending blockbusters or indie classics, SuggestFlix is here to guide your next watch.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Powered by TMDB</h2>
            <p className="text-gray-200">
              All movie and TV show data on SuggestFlix is sourced from TMDB, ensuring you get the most up-to-date and detailed information. TMDB is a community-built movie and TV database, trusted by millions of users worldwide. We are proud to use their API to enhance your movie discovery experience.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Our Team</h2>
          <p className="text-gray-200 mb-4">
            SuggestFlix is built and maintained by a passionate team of movie lovers and developers. We are dedicated to providing a seamless and enjoyable experience for our users. Your feedback and suggestions help us improve and grow.
          </p>
          <h2 className="text-2xl font-semibold text-white mb-4">Join Us</h2>
          <p className="text-gray-200">
            We are always looking for ways to make SuggestFlix better. If you have ideas, feedback, or want to contribute, feel free to reach out via our Contact page. Happy watching!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 