"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogPosts';
import { FinalCTA } from '@/components/sections/home/FinalCTA';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-display text-white mb-4">Post Not Found</h1>
        <p className="text-textSecondary mb-8">The cosmic article you are looking for has vanished into a black hole.</p>
        <Link href="/blog" className="text-accentViolet hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <article className="pt-32 pb-20">
        {/* Header Section */}
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-textDim hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          <div className="mb-6 flex items-center gap-4 text-sm font-mono text-accentViolet">
            <span className="bg-accentViolet/10 px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-textDim text-sm font-mono mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-accentViolet flex items-center justify-center text-bgDeep font-bold">
                {post.author.charAt(0)}
              </span>
              <span className="text-textSecondary">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container mx-auto px-6 max-w-5xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden aspect-[21/9] relative"
          >
            <div className="absolute inset-0 bg-accentViolet/20 mix-blend-overlay z-10" />
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="lead text-xl text-textSecondary mb-8 font-light italic border-l-4 border-accentViolet pl-6">
              {post.excerpt}
            </p>

            <div dangerouslySetInnerHTML={{ __html: post.content }} className="space-y-6 text-textSecondary/90 leading-relaxed [&>h3]:text-white [&>h3]:text-2xl [&>h3]:font-display [&>h3]:mt-8 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2" />
          </div>

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-white font-display text-lg">Share this article</span>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textDim hover:bg-accentViolet hover:text-bgDeep transition-all cursor-pointer">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textDim hover:bg-accentViolet hover:text-bgDeep transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textDim hover:bg-accentViolet hover:text-bgDeep transition-all cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textDim hover:bg-accentViolet hover:text-bgDeep transition-all cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

      <FinalCTA />
    </div>
  );
}
