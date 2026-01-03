"use client";

import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
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
                    Creating Account...
                </>
            ) : (
                <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}

export default function RegisterPage() {
    const [state, formAction] = useActionState(signup, { error: '' });

    return (
        <div className="min-h-screen w-full flex bg-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 z-0 pointer-events-none"></div>

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
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-accent mb-4 shadow-sm">
                                <User className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Get Started</h1>
                            <p className="text-slate-500 text-sm">Create your new account to access the dashboard</p>
                        </div>

                        <form action={formAction} className="space-y-5">
                            {state?.error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                    {state.error}
                                </div>
                            )}
                            {/* Full Name - Optional usually but good for UI, strictly we just need email/pass for supabase defaults unless we handle metadata */}
                            {/* Keeping it simple with Email/Pass to match standard Supabase Auth for now to avoid errors if meta_data isn't set up */}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="store@smartwear.com"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Create a strong password"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Select Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="role" value="admin" className="peer sr-only" />
                                        <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-slate-50 peer-checked:border-accent peer-checked:bg-purple-50 peer-checked:text-accent transition-all text-slate-500 hover:bg-slate-100">
                                            <span className="font-bold text-sm">Admin</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="role" value="cashier" defaultChecked className="peer sr-only" />
                                        <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-slate-50 peer-checked:border-accent peer-checked:bg-purple-50 peer-checked:text-accent transition-all text-slate-500 hover:bg-slate-100">
                                            <span className="font-bold text-sm">Cashier</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="font-bold text-accent hover:text-primary transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Visual Side (Desktop Only) - Reversed from Login */}
            <div className="hidden lg:block w-1/2 h-full bg-slate-50 relative overflow-hidden order-first border-r border-slate-100">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent"></div>

                <div className="absolute bottom-20 right-12 max-w-md p-8 glass-panel rounded-3xl border-0 bg-white/60 backdrop-blur-md text-right">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Start your journey today.</h2>
                    <p className="text-slate-600">
                        Join the fastest growing retail community and transform your business.
                    </p>
                </div>
            </div>

        </div>
    );
}
