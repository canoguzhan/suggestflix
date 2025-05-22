import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, type InstagramPost } from '@/lib/instagram';
import { useQuery } from '@tanstack/react-query';

const BlogPage: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['instagramPosts'],
    queryFn: () => fetchInstagramPosts(6)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Check out our latest Instagram posts from{' '}
            <a
              href="https://instagram.com/suggestflix"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              @suggestflix
            </a>
            .
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg animate-pulse"
              >
                <div className="w-full h-64 bg-gray-700" />
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-white">
            <p>Failed to load Instagram posts. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts?.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg hover:bg-white/20 transition-colors"
              >
                {post.media_type === 'IMAGE' ? (
                  <img
                    src={post.media_url}
                    alt={post.caption || 'Instagram post'}
                    className="w-full h-64 object-cover"
                  />
                ) : post.media_type === 'VIDEO' ? (
                  <video
                    src={post.media_url}
                    className="w-full h-64 object-cover"
                    controls
                  />
                ) : null}
                <div className="p-4">
                  <p className="text-white text-sm mb-2 line-clamp-2">
                    {post.caption}
                  </p>
                  <p className="text-gray-300 text-xs">
                    Posted on {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 