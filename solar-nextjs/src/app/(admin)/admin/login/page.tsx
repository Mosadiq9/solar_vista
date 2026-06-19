'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Sun, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/services/supabase/client';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    setErrorMsg(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setSubmitting(false);
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        description: error.message,
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Welcome Back',
      description: 'You have logged in successfully.',
    });

    // Redirect to dashboard
    router.replace('/admin/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050A0E] px-4 py-12 sm:px-6 lg:px-8">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A623]/[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F5A623]/30 bg-[#F5A623]/10">
            <Sun className="h-6 w-6 text-[#F5A623]" />
          </div>
          <h2 className="mt-6 text-center font-display text-2xl font-black uppercase tracking-tight text-white">
            CHAUHAN SOLAR
          </h2>
          <p className="mt-1.5 text-center text-xs uppercase tracking-wider text-white/40">
            Admin Portal Access
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="test2@gmail.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm font-medium text-white transition-all duration-200 placeholder:text-white/20 focus:border-[#F5A623]/50 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10"
                  />
                </div>
                {errors.email && (
                  <p className="mt-0.5 text-[10px] text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm font-medium text-white transition-all duration-200 placeholder:text-white/20 focus:border-[#F5A623]/50 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/10"
                  />
                </div>
                {errors.password && (
                  <p className="mt-0.5 text-[10px] text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.01, y: -0.5 }}
              whileTap={{ scale: 0.99 }}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5A623] py-3.5 font-display text-xs font-bold uppercase tracking-widest text-[#050A0E] shadow-[0_0_20px_rgba(245,166,35,0.15)] transition-all duration-300 hover:bg-[#FFB84D] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
