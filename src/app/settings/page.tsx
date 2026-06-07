import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import Image from "next/image";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  Zap, 
  ShieldAlert,
  Info
} from "lucide-react";

export default async function SettingsPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const isPro = await checkSubscription();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300 relative py-12">
      {/* Decorative Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative">
        
        {/* Page Header */}
        <div className="border-b-2 border-black dark:border-zinc-800 pb-6 mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Account Settings
          </h1>
          <p className="text-gray-550 dark:text-gray-400 mt-2 text-sm font-medium">
            Manage your personal profile, check your generation credits, and configure subscription billing.
          </p>
        </div>

        {/* Two Column Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
            <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" />
              User Profile
            </h2>

            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-black dark:border-zinc-700 shadow-md mb-4">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-10 h-10 text-zinc-400" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold">{session.user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {session.user.email}
              </p>
            </div>

            {/* Profile Statistics */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500/10" />
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">Available Credits</span>
                </div>
                <span className="text-sm font-extrabold">{session.user.credits} / 10</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-400">Account Tier</span>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded border uppercase ${
                  isPro 
                    ? "bg-green-150 border-green-400 text-green-700 dark:bg-green-950/40 dark:border-green-800 dark:text-green-400" 
                    : "bg-zinc-200 border-zinc-350 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                }`}>
                  {isPro ? "PRO Tier" : "Free Tier"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Billing Control Card */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
            <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500/10" />
              Subscription Details
            </h2>

            {isPro ? (
              <div className="space-y-6">
                <div className="flex p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mr-3" />
                  <div>
                    <h4 className="font-bold text-sm text-green-850 dark:text-green-300">Your Pro Subscription is Active!</h4>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1 leading-relaxed">
                      Thank you for supporting Minerva. You have unlimited course syllabus generations, faster processing, and prioritize priority customer support.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Use the secure Stripe customer portal below to view historical invoices, update billing addresses, or cancel your renewal.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-250 dark:border-yellow-900/30">
                  <ShieldAlert className="w-6 h-6 text-yellow-650 dark:text-yellow-550 flex-shrink-0 mr-3" />
                  <div>
                    <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-400">Upgrade to Minerva Pro</h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1 leading-relaxed">
                      You are currently on the Free limit. Unlock premium tools to elevate your learning.
                    </p>
                  </div>
                </div>

                {/* Pro Features List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-500 dark:text-zinc-400">Included in Pro</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-4 h-4 bg-violet-100 dark:bg-violet-950 rounded-full flex items-center justify-center text-[10px] text-violet-600 dark:text-violet-400">✓</span>
                      Unlimited course syllabus generations
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-4 h-4 bg-violet-100 dark:bg-violet-950 rounded-full flex items-center justify-center text-[10px] text-violet-600 dark:text-violet-400">✓</span>
                      Higher speed transcript parsing
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold">
                      <span className="w-4 h-4 bg-violet-100 dark:bg-violet-950 rounded-full flex items-center justify-center text-[10px] text-violet-600 dark:text-violet-400">✓</span>
                      Comprehensive adaptive quizzes
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8">
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
