import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/QuizCards";
import { prisma } from "@/lib/db";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const CoursePage = async ({ params: { slug } }: Props) => {
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });
  if (!course) {
    return redirect("/gallery");
  }
  let unitIndex = parseInt(unitIndexParam);
  let chapterIndex = parseInt(chapterIndexParam);

  const unit = course.units[unitIndex];
  if (!unit) {
    return redirect("/gallery");
  }
  const chapter = unit.chapters[chapterIndex];
  if (!chapter) {
    return redirect("/gallery");
  }
  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300 relative">
      
      {/* Decorative Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Modern Flex Layout: Sidebar + Main Content */}
      <div className="relative flex flex-col md:flex-row items-stretch min-h-screen">
        
        {/* Sticky Sidebar */}
        <CourseSideBar course={course} currentChapterId={chapter.id} />

        {/* Content Panel */}
        <div className="flex-1 px-4 sm:px-8 py-8 md:max-w-6xl mx-auto w-full">
          
          {/* Main Dashboard Layout (Video + Quiz) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left: Video Player & Summary */}
            <div className="flex-[2] w-full">
              <MainVideoSummary
                chapter={chapter}
                chapterIndex={chapterIndex}
                unit={unit}
                unitIndex={unitIndex}
              />
            </div>
            
            {/* Right: Concept Check Quiz */}
            <div className="flex-[1] w-full lg:sticky lg:top-24">
              <QuizCards chapter={chapter} />
            </div>

          </div>

          <div className="h-[2px] mt-12 bg-black/10 dark:bg-zinc-800" />
          
          {/* Prev/Next Chapter Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
            {prevChapter ? (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all mr-auto w-full sm:w-auto text-left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-zinc-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 dark:text-zinc-500">
                    Previous Chapter
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate max-w-[200px]">
                    {prevChapter.name}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}

            {nextChapter ? (
              <Link
                href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}
                className="flex items-center gap-3 p-4 bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ml-auto w-full sm:w-auto text-right justify-end"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black tracking-wider text-black/60">
                    Next Chapter
                  </span>
                  <span className="text-sm font-bold text-black truncate max-w-[200px]">
                    {nextChapter.name}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-black flex-shrink-0" />
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
