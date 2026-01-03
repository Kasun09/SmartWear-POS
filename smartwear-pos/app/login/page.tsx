"use client";

import Link from "next/link";
import { login } from "@/app/auth/actions";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="w-full bg-primary text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                </>
            ) : (
                <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, { error: '' });

    return (
        <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none"></div>

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="w-full h-screen flex items-center justify-center z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-primary mb-4 shadow-sm">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                            <p className="text-slate-500 text-sm">Sign in to your dashboard to continue</p>
                        </div>

                        <form action={formAction} className="space-y-6">
                            {state?.error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                    {state.error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="admin@smartwear.com"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                                    <a href="#" className="text-xs font-bold text-primary hover:text-accent transition-colors">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{' '}
                                <Link href="/register" className="font-bold text-primary hover:text-accent transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Visual Side (Desktop Only) */}
            <div className="hidden lg:block w-1/2 h-full bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/20 to-transparent"></div>

                <div className="absolute bottom-20 left-12 max-w-md p-8 glass-panel rounded-3xl border-0 bg-white/60 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Manage your store with confidence.</h2>
                    <p className="text-slate-600">
                        Join thousands of retailers who trust SmartWear POS for their daily operations.
                    </p>
                </div>
            </div>
        </div>
    );
}
