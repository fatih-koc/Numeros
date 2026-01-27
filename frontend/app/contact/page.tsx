"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accentViolet/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accentIndigo/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            Contact the Cosmos
          </h1>
          <p className="text-xl text-textSecondary max-w-2xl mx-auto">
            Have a question about your chart? Need guidance navigating the Numeros platform?
            We are here to help you connect with the stars.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-bgMid/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-display text-white mb-6">Get in Touch</h3>

              <div className="flex items-start space-x-4">
                <div className="bg-accentViolet/20 p-3 rounded-lg text-accentViolet">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Email Us</h4>
                  <p className="text-textSecondary mb-1">General Inquiries</p>
                  <a href="mailto:hello@numeros.com" className="text-accentViolet hover:text-white transition-colors">
                    hello@numeros.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accentPink/20 p-3 rounded-lg text-accentPink">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Support</h4>
                  <p className="text-textSecondary mb-1">Technical Assistance</p>
                  <a href="mailto:support@numeros.com" className="text-accentPink hover:text-white transition-colors">
                    support@numeros.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accentIndigo/20 p-3 rounded-lg text-accentIndigo">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Location</h4>
                  <p className="text-textSecondary">
                    123 Celestial Avenue<br />
                    Nebula District, CA 90210
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1681673819379-a183d9acf860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBkZWVwJTIwc3BhY2UlMjBuZWJ1bGF8ZW58MXx8fHwxNzY5NDk5OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cosmic Nebula"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bgDeep/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/90 font-display text-lg italic">
                  &quot;The universe is not outside of you. Look inside yourself; everything that you want, you already are.&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-bgMid/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10"
          >
            <h3 className="text-2xl font-display text-white mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-textSecondary">Name</label>
                  <input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full bg-bgDeep/50 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors`}
                    placeholder="Your Name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-textSecondary">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full bg-bgDeep/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-textSecondary">Subject</label>
                <div className="relative">
                  <select
                    id="subject"
                    {...register('subject', { required: 'Please select a subject' })}
                    className={`w-full bg-bgDeep/50 border ${errors.subject ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors appearance-none cursor-pointer`}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="readings">Reading Interpretation</option>
                    <option value="partnership">Partnerships</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-textSecondary">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  className={`w-full bg-bgDeep/50 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentViolet transition-colors resize-none`}
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-accentViolet to-accentIndigo text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
