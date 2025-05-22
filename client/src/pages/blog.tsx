import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, type InstagramPost } from '@/lib/instagram';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 6;

const BlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['instagramPosts'],
    queryFn: () => fetchInstagramPosts() // Remove the limit parameter
  });

  const totalPages = posts ? Math.ceil(posts.length / POSTS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts?.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
          <div className="space-y-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg animate-pulse flex"
              >
                <div className="w-1/3 h-48 bg-gray-700" />
                <div className="w-2/3 p-4">
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
          <>
            <div className="space-y-6 max-w-6xl mx-auto">
              {currentPosts?.map((post, index) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg hover:bg-white/20 transition-colors flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-1/3 h-48 md:h-auto">
                    {post.media_type === 'IMAGE' ? (
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Instagram post'}
                        className="w-full h-full object-cover"
                      />
                    ) : post.media_type === 'VIDEO' ? (
                      <video
                        src={post.media_url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : null}
                  </div>
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <p className="text-white text-base mb-4 whitespace-pre-wrap">
                      {post.caption}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Posted on {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 