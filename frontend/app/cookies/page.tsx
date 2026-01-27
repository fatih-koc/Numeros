"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Cookie, Settings, Info } from 'lucide-react';

export default function Cookies() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Cookie Policy</h1>
          <p className="text-textSecondary text-lg mb-8">
            Last updated: January 27, 2026
          </p>

          <div className="bg-bgMid/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentIndigo flex items-center gap-2">
                <Info size={24} /> 1. What Are Cookies?
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                They are widely used to make websites work more efficiently and to provide information to the owners of the site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentIndigo flex items-center gap-2">
                <Cookie size={24} /> 2. How We Use Cookies
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Numeros uses cookies for the following purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-bgDeep/50 p-6 rounded-xl border border-white/5">
                  <h3 className="text-white font-medium mb-2">Essential Cookies</h3>
                  <p className="text-textSecondary text-sm">
                    Necessary for the website to function properly. This includes cookies that allow you to log in to secure areas of our website.
                  </p>
                </div>
                <div className="bg-bgDeep/50 p-6 rounded-xl border border-white/5">
                  <h3 className="text-white font-medium mb-2">Analytical Cookies</h3>
                  <p className="text-textSecondary text-sm">
                    Allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.
                  </p>
                </div>
                <div className="bg-bgDeep/50 p-6 rounded-xl border border-white/5">
                  <h3 className="text-white font-medium mb-2">Functionality Cookies</h3>
                  <p className="text-textSecondary text-sm">
                    Used to recognize you when you return to our website. This enables us to personalize our content for you (e.g., remembering your chart preferences).
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentIndigo flex items-center gap-2">
                <Settings size={24} /> 3. Managing Cookies
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Most web browsers allow some control of most cookies through the browser settings.
                To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accentIndigo hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-accentIndigo hover:underline">www.allaboutcookies.org</a>.
              </p>
            </section>

            <div className="pt-8 border-t border-white/10">
              <p className="text-textDim text-sm">
                For more information about how we use your information, please see our <Link href="/privacy" className="text-accentIndigo hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
