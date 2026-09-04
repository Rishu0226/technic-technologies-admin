"use client";

import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { ApiClient } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      await ApiClient.post('/api/auth/login', data);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1221] font-sans text-slate-300 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <span className="text-white font-bold text-3xl leading-none">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Technic Admin</h1>
          <p className="text-slate-400 font-light">Sign in to manage your platforms</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full px-5 py-4 rounded-xl bg-[#0B1221]/50 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="admin@technic.dev"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full px-5 py-4 rounded-xl bg-[#0B1221]/50 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
