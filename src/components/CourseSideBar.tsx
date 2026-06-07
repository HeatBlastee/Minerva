import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";
import { BookOpen, CheckCircle, Circle, PlayCircle } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
};

const CourseSideBar = async ({ course, currentChapterId }: Props) => {
  return (
    <div className="w-full md:w-[320px] lg:w-[380px] md:sticky md:top-16 md:h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-900/60 border-b-2 md:border-b-0 md:border-r-2 border-black dark:border-zinc-800 overflow-y-auto flex-shrink-0 p-6 z-[8]">
      
      {/* Course Title Header */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-black uppercase text-violet-600 dark:text-violet-400">
          <BookOpen className="w-4 h-4" />
          <span>Course Syllabus</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
          {course.name}
        </h1>
      </div>

      {/* Units & Chapters List */}
      <div className="space-y-6">
        {course.units.map((unit, unitIndex) => {
          return (
            <div key={unit.id} className="space-y-3">
              {/* Unit Headers */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Unit {unitIndex + 1}
                </span>
                <h2 className="text-base font-extrabold text-gray-800 dark:text-zinc-200 leading-snug">
                  {unit.name}
                </h2>
              </div>

              {/* Chapters List */}
              <div className="space-y-1.5 pl-2 border-l border-gray-200 dark:border-zinc-800">
                {unit.chapters.map((chapter, chapterIndex) => {
                  const isActive = chapter.id === currentChapterId;
                  return (
                    <Link
                      key={chapter.id}
                      href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                      className={cn(
                        "group flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold transition-all border border-transparent",
                        isActive
                          ? "bg-white dark:bg-zinc-800 text-violet-700 dark:text-violet-400 border-black dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none font-black"
                          : "text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/30"
                      )}
                    >
                      {isActive ? (
                        <PlayCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 fill-violet-50 dark:fill-violet-950/20 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-gray-400 group-hover:text-black dark:group-hover:text-white flex-shrink-0" />
                      )}
                      <span className="truncate">{chapter.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {unitIndex < course.units.length - 1 && (
                <Separator className="mt-4 bg-gray-200 dark:bg-zinc-800" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSideBar;
