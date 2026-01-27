"use client";

import React from 'react';
import { motion } from 'motion/react';
import { BlogCard } from '@/components/sections/blog/BlogCard';
import { FinalCTA } from '@/components/sections/home/FinalCTA';
import { BLOG_POSTS } from '@/data/blogPosts';

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-accentViolet/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accentIndigo/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-4 block">
              Cosmic Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-6">
              Insights from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentViolet to-accentIndigo">Universe</span>
            </h1>
            <p className="text-lg text-textSecondary font-light leading-relaxed">
              Explore the depths of numerology, astrology, and relationship science.
              Our latest articles to help you navigate your cosmic journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {BLOG_POSTS.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
