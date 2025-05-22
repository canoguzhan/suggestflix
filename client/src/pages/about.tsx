import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About SuggestFlix</h1>
          <p className="text-xl text-gray-300">Your AI-Powered Movie Recommendation Platform</p>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              At SuggestFlix, we're revolutionizing the way people discover movies. Our mission is to
              connect viewers with their perfect next watch using cutting-edge AI technology and
              personalized recommendations.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We leverage advanced artificial intelligence to analyze your viewing preferences and
              provide tailored movie suggestions. Our platform considers various factors including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your viewing history and preferences</li>
              <li>Genre preferences and mood</li>
              <li>Similar user patterns and ratings</li>
              <li>Current trends and popular content</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-300 leading-relaxed">
              We are a passionate team of movie enthusiasts, data scientists, and technology experts
              dedicated to creating the best movie discovery experience. Our diverse backgrounds and
              shared love for cinema drive us to continuously improve our recommendation system.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
            <p className="text-gray-300 leading-relaxed">
              Whether you're a casual movie watcher or a dedicated cinephile, SuggestFlix is here to
              enhance your movie-watching experience. Join our growing community and discover your
              next favorite film today!
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 