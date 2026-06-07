"use client";

import React from "react";
import axios from "axios";
import { Zap, CreditCard } from "lucide-react";

type Props = { isPro: boolean };

const SubscriptionButton = ({ isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("billing error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleSubscribe}
      className={`w-full py-3.5 text-center font-black text-black border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
        isPro 
          ? "bg-white dark:bg-zinc-900 dark:text-white" 
          : "bg-yellow-400 dark:bg-yellow-500"
      }`}
    >
      {isPro ? (
        <>
          <CreditCard className="w-4 h-4" />
          Manage Subscriptions
        </>
      ) : (
        <>
          <Zap className="w-4 h-4 fill-current stroke-current" />
          Upgrade to Pro Tier
        </>
      )}
    </button>
  );
};

export default SubscriptionButton;
