"use client";

import React, { useState } from "react";
import Image from "next/image";
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
      await ApiClient.post("/api/auth/login", data);
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-technic-bg font-sans text-technic-secondary flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-10 -left-16 w-72 h-72 bg-technic-cyan/15 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 -right-16 w-72 h-72 bg-technic-orange/15 rounded-full blur-3xl" aria-hidden="true" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Image
            src="/Assest/logo-brand.png"
            alt="Technic Technologies"
            width={240}
            height={80}
            className="h-20 w-auto mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-bold text-technic-text mb-2">Welcome Back</h1>
          <p className="text-technic-muted">Sign in to manage your platforms</p>
        </div>

        <div className="bg-white border border-technic-border rounded-3xl p-8 shadow-tn-lg">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-technic-error-soft border border-technic-error/20 text-technic-error text-sm" role="alert">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="tn-label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: true })}
                className="tn-input"
                placeholder="admin@technic.dev"
              />
            </div>
            <div>
              <label htmlFor="password" className="tn-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
                className="tn-input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-opacity hover:opacity-95 shadow-tn-sm"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
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
