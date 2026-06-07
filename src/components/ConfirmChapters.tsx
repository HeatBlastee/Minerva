"use client";

import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });

  const [completedChapters, setCompletedChapters] = React.useState<Set<String>>(
    new Set()
  );

  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  return (
    <div className="w-full">
      <div className="space-y-6">
        {course.units.map((unit, unitIndex) => {
          return (
            <div key={unit.id} className="p-4 bg-zinc-55 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <span className="text-[10px] uppercase font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-850">
                Unit {unitIndex + 1}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-2 mb-3">
                {unit.name}
              </h3>
              
              <div className="space-y-2.5">
                {unit.chapters.map((chapter, chapterIndex) => {
                  return (
                    <ChapterCard
                      completedChapters={completedChapters}
                      setCompletedChapters={setCompletedChapters}
                      ref={chapterRefs[chapter.id]}
                      key={chapter.id}
                      chapter={chapter}
                      chapterIndex={chapterIndex}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Controls */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-150 dark:border-zinc-800 gap-4">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-xl hover:bg-gray-150 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Create
        </Link>

        {totalChaptersCount === completedChapters.size ? (
          <Link
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-black text-black bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            href={`/course/${course.id}/0/0`}
          >
            Start Course
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            type="button"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-black text-black bg-violet-400 hover:bg-violet-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50"
            onClick={async () => {
              setLoading(true);
              for (const ref of Object.values(chapterRefs)) {
                await ref.current?.triggerLoad();
              }
              setLoading(false);
            }}
          >
            Generate Content
            <Play className="w-4 h-4 fill-current stroke-current" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmChapters;
