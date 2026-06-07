"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { Progress } from "./ui/progress";
import { Zap, Sparkles } from "lucide-react";
import axios from "axios";

type Props = {};

const SubscriptionAction = (props: Props) => {
  const { data } = useSession();
  const [loading, setLoading] = React.useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const credits = data?.user?.credits ?? 0;
  const percentage = Math.min((credits / 10) * 100, 100);

  return (
    <div className="flex flex-col p-6 mt-8 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-750 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-violet-500 fill-violet-100 dark:fill-violet-950" />
        <h3 className="font-extrabold text-sm text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
          Generation Balance
        </h3>
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <span className="text-3xl font-black text-gray-900 dark:text-white">
          {credits} / 10
        </span>
        <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
          Free Course Credits Used
        </span>
      </div>

      <div className="relative w-full h-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-violet-600 dark:bg-violet-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed font-medium">
        Upgrade to Pro to remove credit limits, unlock infinite course creation, and experience premium high-speed video processing.
      </p>

      <button
        disabled={loading}
        onClick={handleSubscribe}
        className="w-full py-3 text-center font-black text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        Upgrade to Pro
        <Zap className="w-4 h-4 fill-current stroke-current" />
      </button>
    </div>
  );
};

export default SubscriptionAction;
