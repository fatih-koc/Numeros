"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl mb-6 relative aspect-[4/3]">
        <div className="absolute inset-0 bg-accentViolet/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 text-xs font-mono font-medium tracking-wider bg-bgDeep/80 backdrop-blur-sm text-accentViolet border border-accentViolet/30 rounded-full uppercase">
            {post.category}
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-sm text-textDim mb-3 font-mono">
          <time dateTime={post.date}>{post.date}</time>
          <span>-</span>
          <span>5 min read</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="group-hover:text-accentViolet transition-colors duration-300">
          <h3 className="text-2xl font-display text-white mb-3 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-textSecondary text-base leading-relaxed mb-6 flex-1">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-white font-medium hover:text-accentViolet transition-colors duration-300 mt-auto"
        >
          Read Article <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
