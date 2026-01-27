"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, User, ChevronRight, Sparkles, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { calculateProfile, captureEmail, APIError } from '@/lib/api';
import { calculateAllNumbers } from '@/lib/numerology';
import { toast } from 'sonner';

type FormData = {
  email: string;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

export default function CreateChart() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useClientCalculation, setUseClientCalculation] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Try API first
      if (!useClientCalculation) {
        try {
          const result = await calculateProfile({
            name: data.fullName,
            birth_date: data.birthDate,
            birth_time: data.birthTime || undefined,
          });

          // Capture email with results (sends email via backend SES)
          await captureEmail({
            email: data.email,
            name: data.fullName,
            birth_date: data.birthDate,
            numerology: {
              life_path: result.numerology.life_path,
              soul_urge: result.numerology.soul_urge,
              expression: result.numerology.expression,
              personality: result.numerology.personality,
            },
            source: 'calculator',
          });

          // Store results for results page
          sessionStorage.setItem('numerologyData', JSON.stringify({
            fullName: data.fullName,
            birthDate: data.birthDate,
            email: data.email,
            ...result.numerology,
            astrology: result.astrology,
            chart_level: result.chart_level,
            source: 'api',
          }));

          toast.success('Your cosmic profile has been calculated!');
          router.push('/numerology/results');
          return;
        } catch (error) {
          if (error instanceof APIError) {
            console.warn('API unavailable, falling back to client calculation');
            setUseClientCalculation(true);
          } else {
            throw error;
          }
        }
      }

      // Fallback: Client-side calculation
      const numbers = calculateAllNumbers(data.fullName, data.birthDate);

      // Capture email (sends email via backend SES)
      await captureEmail({
        email: data.email,
        name: data.fullName,
        birth_date: data.birthDate,
        numerology: {
          life_path: numbers.life_path,
          soul_urge: numbers.soul_urge,
          expression: numbers.expression,
          personality: numbers.personality,
        },
        source: 'calculator',
      });

      // Store results
      sessionStorage.setItem('numerologyData', JSON.stringify({
        fullName: data.fullName,
        birthDate: data.birthDate,
        email: data.email,
        ...numbers,
        source: 'client',
      }));

      toast.success('Your numerology profile is ready!');
      router.push('/numerology/results');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDeep text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentViolet/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-soulUrge/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase">Free Calculation</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-light mb-4"
          >
            Discover Your <span className="text-expression">Cosmic Numbers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-textSecondary font-light max-w-lg mx-auto"
          >
            Enter your birth data to reveal your numerology blueprint — Life Path, Soul Urge, Expression, and Personality numbers.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30 rounded-tl-lg m-4" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30 rounded-tr-lg m-4" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30 rounded-bl-lg m-4" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30 rounded-br-lg m-4" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input - Primary lead capture */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-accentViolet uppercase tracking-widest">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required to receive your results",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5 transition-all placeholder:text-white/20"
                placeholder="your@email.com"
              />
              {errors.email && (
                <span className="text-accentPink text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </span>
              )}
              <p className="text-xs text-textDim">We&apos;ll send your full results to this email</p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-soulUrge uppercase tracking-widest">
                <User className="w-4 h-4" /> Full Birth Name
              </label>
              <input
                {...register("fullName", { required: "Full Name is required for Numerology" })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5 transition-all placeholder:text-white/20"
                placeholder="As it appears on birth certificate"
              />
              {errors.fullName && (
                <span className="text-accentPink text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-soulUrge uppercase tracking-widest">
                  <Calendar className="w-4 h-4" /> Date of Birth
                </label>
                <input
                  type="date"
                  {...register("birthDate", { required: "Date of Birth is required" })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5 transition-all text-white/90 [color-scheme:dark]"
                />
                {errors.birthDate && (
                  <span className="text-accentPink text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.birthDate.message}
                  </span>
                )}
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-soulUrge uppercase tracking-widest">
                  <Clock className="w-4 h-4" /> Time of Birth
                </label>
                <div className="relative">
                  <input
                    type="time"
                    {...register("birthTime")}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5 transition-all text-white/90 [color-scheme:dark]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-textDim pointer-events-none">Optional</span>
                </div>
                <p className="text-xs text-textDim">For precise Moon & rising sign</p>
              </div>
            </div>

            {/* Place Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-soulUrge uppercase tracking-widest">
                <MapPin className="w-4 h-4" /> Place of Birth
              </label>
              <input
                {...register("birthPlace")}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5 transition-all placeholder:text-white/20"
                placeholder="City, Country (optional)"
              />
              <p className="text-xs text-textDim">For complete birth chart with houses</p>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" /> Calculating Your Blueprint...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Calculate My Numbers <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
              <p className="text-center text-xs text-textDim mt-4">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-accentViolet hover:underline">Terms</a>
                {' '}and{' '}
                <a href="/privacy" className="text-accentViolet hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </form>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-textDim space-y-2"
        >
          <p>Calculated using the Pythagorean system • Same inputs = same results</p>
          <p className="flex items-center justify-center gap-4">
            <span>🔒 Your data stays private</span>
            <span>⚡ Instant results</span>
            <span>📧 Emailed to you</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
