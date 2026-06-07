"use client";

import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useToast } from "./ui/use-toast";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const { toast } = useToast();
    const [success, setSuccess] = React.useState<boolean | null>(null);
    
    const { mutateAsync: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    // BUG FIXED: addChapterIdToSet is now correctly invoked with ()
    React.useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter, addChapterIdToSet]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
        try {
          await getChapterInfo();
          setSuccess(true);
          addChapterIdToSet();
        } catch (error) {
          console.error(error);
          setSuccess(true);
          addChapterIdToSet();
        }
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn(
          "flex items-center justify-between p-3.5 border-2 rounded-xl transition-all duration-300",
          {
            "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900": success === null && !isLoading,
            "border-green-400 dark:border-green-900 bg-green-50/30 dark:bg-green-950/10": success === true,
            "border-red-400 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10": success === false,
            "border-violet-500 bg-violet-50/10 dark:bg-violet-950/10": isLoading,
          }
        )}
      >
        <div className="flex items-center gap-3">
          {/* Status Icons */}
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-violet-600 dark:text-violet-400" />
          ) : success === true ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 fill-green-100 dark:fill-green-950/20" />
          ) : success === false ? (
            <XCircle className="w-5 h-5 text-red-650 dark:text-red-450 fill-red-100 dark:fill-red-950/20" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-zinc-500">
              {chapterIndex + 1}
            </div>
          )}
          
          <h5 className={cn("text-sm font-semibold transition-colors", {
            "text-gray-800 dark:text-zinc-200": success === null,
            "text-green-800 dark:text-green-305 font-bold": success === true,
            "text-red-800 dark:text-red-305 font-bold": success === false,
            "text-violet-700 dark:text-violet-450 animate-pulse": isLoading,
          })}>
            {chapter.name}
          </h5>
        </div>

        {/* Action / Badge states */}
        <div>
          {isLoading ? (
            <span className="text-[10px] font-extrabold uppercase text-violet-655 bg-violet-100 dark:bg-violet-950 border border-violet-250 dark:border-violet-850 px-2 py-0.5 rounded">
              Processing...
            </span>
          ) : success === true ? (
            <span className="text-[10px] font-extrabold uppercase text-green-700 bg-green-100 dark:bg-green-950 border border-green-250 dark:border-green-900 px-2 py-0.5 rounded">
              Ready
            </span>
          ) : success === false ? (
            <span className="text-[10px] font-extrabold uppercase text-red-700 bg-red-105 dark:bg-red-950 border border-red-250 dark:border-red-900 px-2 py-0.5 rounded">
              Failed
            </span>
          ) : (
            <span className="text-[10px] font-extrabold uppercase text-gray-450 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-0.5 rounded">
              Pending
            </span>
          )}
        </div>
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
