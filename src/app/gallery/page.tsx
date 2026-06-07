import GalleryCourseCard from "@/components/GalleryCourseCard";
import { prisma } from "@/lib/db";
import React from "react";
import { Compass } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function GalleryPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: { chapters: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300 relative py-12">
      {/* Decorative Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-black dark:border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-900 rounded-full text-yellow-800 dark:text-yellow-300 text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Community Knowledge</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-1">
              Course Gallery
            </h1>
            <p className="text-gray-550 dark:text-gray-400 mt-2 max-w-xl text-sm font-medium">
              Browse syllabus journeys created by the community. Click on any unit or chapter to start learning immediately.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-bold text-gray-400 dark:text-zinc-650">
            Total Available: <strong className="text-black dark:text-white font-extrabold">{courses.length} Courses</strong>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl">
            <Compass className="w-16 h-16 text-gray-450 dark:text-zinc-600 animate-spin-slow mb-4" />
            <h3 className="text-xl font-bold">No Courses Generated Yet</h3>
            <p className="text-gray-550 dark:text-gray-400 text-sm mt-1 max-w-xs">
              Be the first to create an AI course and populate the gallery!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {courses.map((course) => (
              <GalleryCourseCard course={course} key={course.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
