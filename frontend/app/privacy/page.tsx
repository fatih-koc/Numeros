"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Privacy Policy</h1>
          <p className="text-textSecondary text-lg mb-8">
            Last updated: January 27, 2026
          </p>

          <div className="bg-bgMid/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentViolet flex items-center gap-2">
                <Shield size={24} /> 1. Introduction
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Welcome to Numeros (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from)
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentViolet flex items-center gap-2">
                <FileText size={24} /> 2. Data We Collect
              </h2>
              <p className="text-textSecondary leading-relaxed">
                To provide accurate cosmic compatibility charts and numerology readings, we collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4">
                <li><strong>Identity Data:</strong> First name, last name, and birth name (if different).</li>
                <li><strong>Cosmic Data:</strong> Date of birth, time of birth (optional), and place of birth. This is strictly used to calculate your astrological and numerological charts.</li>
                <li><strong>Contact Data:</strong> Email address.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentViolet flex items-center gap-2">
                <Lock size={24} /> 3. How We Use Your Data
              </h2>
              <p className="text-textSecondary leading-relaxed">
                We will only use your personal data when the law allows us to. Most commonly, we use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4">
                <li>To generate your personalized numerology and astrology reports.</li>
                <li>To manage your account and subscription.</li>
                <li>To improve our website, products/services, marketing, and customer relationships.</li>
              </ul>
              <p className="text-textSecondary leading-relaxed mt-2">
                <strong>Important:</strong> We do not sell your personal birth data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentViolet flex items-center gap-2">
                <Eye size={24} /> 4. Data Security
              </h2>
              <p className="text-textSecondary leading-relaxed">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentViolet">5. Your Legal Rights</h2>
              <p className="text-textSecondary leading-relaxed">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
              </p>
            </section>

            <div className="pt-8 border-t border-white/10">
              <p className="text-textDim text-sm">
                If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@numeros.com" className="text-accentViolet hover:underline">privacy@numeros.com</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
