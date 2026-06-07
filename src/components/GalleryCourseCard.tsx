import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BookOpen } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const GalleryCourseCard = async ({ course }: Props) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] transition-all duration-300 w-full flex flex-col justify-between h-full">
      <div className="relative group">
        <Link
          href={`/course/${course.id}/0/0`}
          className="relative block w-full aspect-video overflow-hidden border-b-2 border-black dark:border-zinc-700"
        >
          {course.image ? (
            <Image
              src={course.image}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              width={400}
              height={225}
              alt={course.name}
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-zinc-400" />
            </div>
          )}
          
          {/* Neobrutalist Course Title overlay banner */}
          <div className="absolute bottom-2 left-2 right-2 bg-yellow-400 dark:bg-yellow-500 text-black border border-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] truncate">
            {course.name}
          </div>
        </Link>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-bold">
              Course Syllabus
            </h4>
            <span className="text-[10px] bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-200 px-2 py-0.5 rounded-md border border-violet-300 dark:border-violet-800 font-extrabold uppercase">
              {course.units.length} {course.units.length === 1 ? "Unit" : "Units"}
            </span>
          </div>

          <div className="space-y-2">
            {course.units.map((unit, unitIndex) => {
              return (
                <Link
                  href={`/course/${course.id}/${unitIndex}/0`}
                  key={unit.id}
                  className="group/item flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 hover:border-black dark:hover:border-zinc-600 transition-colors"
                >
                  <span className="w-5 h-5 text-[10px] bg-zinc-200 dark:bg-zinc-805 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {unitIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-750 dark:text-zinc-300 truncate group-hover/item:text-black dark:group-hover/item:text-white">
                    {unit.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-150 dark:border-zinc-800 flex justify-end">
          <Link
            href={`/course/${course.id}/0/0`}
            className="text-xs font-extrabold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            Start Learning
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GalleryCourseCard;
