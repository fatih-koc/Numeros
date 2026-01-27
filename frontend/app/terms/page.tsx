"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ScrollText, AlertCircle, Scale, Ban } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 md:py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Terms of Service</h1>
          <p className="text-textSecondary text-lg mb-8">
            Last updated: January 27, 2026
          </p>

          <div className="bg-bgMid/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentPink flex items-center gap-2">
                <ScrollText size={24} /> 1. Agreement to Terms
              </h2>
              <p className="text-textSecondary leading-relaxed">
                By accessing or using the Numeros website, you agree to be bound by these Terms of Service and our Privacy Policy.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentPink flex items-center gap-2">
                <AlertCircle size={24} /> 2. Disclaimer
              </h2>
              <div className="p-4 bg-accentPink/10 border border-accentPink/20 rounded-lg">
                <p className="text-white/90 font-medium">
                  For Entertainment Purposes Only
                </p>
                <p className="text-textSecondary mt-2 text-sm leading-relaxed">
                  The services provided by Numeros, including but not limited to numerology reports, astrological charts, and compatibility readings, are for entertainment purposes only.
                  Numeros does not guarantee the accuracy of any predictions or analysis. Our services should not be used as a substitute for professional advice (medical, legal, financial, or psychological).
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentPink flex items-center gap-2">
                <Scale size={24} /> 3. Intellectual Property
              </h2>
              <p className="text-textSecondary leading-relaxed">
                The content on the Numeros platform, including text, graphics, logos, images, and software, is the property of Numeros and is protected by copyright and other intellectual property laws.
                You may not use, reproduce, or distribute any content from our website without our prior written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentPink flex items-center gap-2">
                <Ban size={24} /> 4. Prohibited Activities
              </h2>
              <p className="text-textSecondary leading-relaxed">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4">
                <li>Using the service for any illegal purpose.</li>
                <li>Attempting to interfere with the proper functioning of the website.</li>
                <li>Scraping or harvesting data from our platform.</li>
                <li>Impersonating another person or entity.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-display text-accentPink">5. Limitation of Liability</h2>
              <p className="text-textSecondary leading-relaxed">
                To the fullest extent permitted by law, Numeros shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
              </p>
            </section>

            <div className="pt-8 border-t border-white/10">
              <p className="text-textDim text-sm">
                Contact us at <a href="mailto:legal@numeros.com" className="text-accentPink hover:underline">legal@numeros.com</a> for any questions regarding these Terms.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
