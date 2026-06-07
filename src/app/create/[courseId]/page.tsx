import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ConfirmChapters from "@/components/ConfirmChapters";
import { Info, HelpCircle } from "lucide-react";

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapters = async ({ params: { courseId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });
  if (!course) {
    return redirect("/create");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300 relative py-12">
      {/* Decorative Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 relative flex flex-col items-stretch">
        
        {/* Header Section */}
        <div className="border-b-2 border-black dark:border-zinc-800 pb-6 mb-8 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Generation Draft
          </span>
          <h5 className="text-sm font-extrabold text-gray-400 dark:text-zinc-500 mt-1 uppercase">
            Course Name
          </h5>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mt-1">
            {course.name}
          </h1>
        </div>

        {/* Info Card Box */}
        <div className="flex items-start p-5 bg-blue-50 dark:bg-blue-950/20 border-2 border-black dark:border-blue-900/40 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none mb-8">
          <Info className="w-6 h-6 mr-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium text-blue-900 dark:text-blue-300 leading-relaxed">
            We generated course chapters corresponding to each of your selected units. Please review the syllabus structure below, and click **Generate** to begin retrieving full video contents and quizzes.
          </div>
        </div>

        {/* Chapters Confirmation form */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
          <ConfirmChapters course={course} />
        </div>
      </div>
    </div>
  );
};

export default CreateChapters;
