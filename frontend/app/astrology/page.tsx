"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Star, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type FormData = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

export default function Astrology() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    sessionStorage.setItem('astrologyData', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    router.push('/astrology/results');
  };

  return (
    <div className="min-h-screen bg-bgDeep text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accentPink/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accentViolet/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-accentViolet/10 text-accentViolet"
          >
            <Star className="w-6 h-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-light mb-4"
          >
            Map Your <span className="text-accentPink">Celestial Blueprint</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary font-light"
          >
            Calculate your Natal Chart to reveal the planetary positions at your exact moment of birth.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30 rounded-tl-lg m-4" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30 rounded-tr-lg m-4" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30 rounded-bl-lg m-4" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30 rounded-br-lg m-4" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-accentPink uppercase tracking-widest">
                  <Calendar className="w-4 h-4" /> Date of Birth
                </label>
                <input
                  type="date"
                  {...register("birthDate", { required: "Date of Birth is required" })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentPink/50 focus:bg-accentPink/5 transition-all text-white/90 [color-scheme:dark]"
                />
                {errors.birthDate && <span className="text-accentPink text-xs">{errors.birthDate.message}</span>}
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-accentPink uppercase tracking-widest">
                  <Clock className="w-4 h-4" /> Exact Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    {...register("birthTime", { required: "Birth Time is required for Ascendant" })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentPink/50 focus:bg-accentPink/5 transition-all text-white/90 [color-scheme:dark]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-textDim pointer-events-none">Local Time</span>
                </div>
                {errors.birthTime && <span className="text-accentPink text-xs">{errors.birthTime.message}</span>}
              </div>
            </div>

            {/* Place Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-mono text-accentPink uppercase tracking-widest">
                <MapPin className="w-4 h-4" /> Place of Birth
              </label>
              <input
                {...register("birthPlace", { required: "Birth Place is required for House calculation" })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accentPink/50 focus:bg-accentPink/5 transition-all placeholder:text-white/20"
                placeholder="City, State, Country"
              />
              {errors.birthPlace && <span className="text-accentPink text-xs">{errors.birthPlace.message}</span>}
            </div>

            <div className="pt-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" /> Aligning Stars...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Calculate Natal Chart <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
              <p className="text-center text-xs text-textDim mt-4">
                Precise birth time ensures accurate Ascendant and House placements.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
