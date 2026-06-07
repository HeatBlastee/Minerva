import { Chapter, Unit } from "@prisma/client";
import React from "react";
import { Video, ScrollText } from "lucide-react";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

const MainVideoSummary = ({
  unit,
  unitIndex,
  chapter,
  chapterIndex,
}: Props) => {
  return (
    <div className="w-full space-y-8">
      {/* Title Panel */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-850 rounded-full text-violet-750 dark:text-violet-400 text-[10px] font-black uppercase tracking-wider">
          <Video className="w-3 h-3 fill-current" />
          <span>Unit {unitIndex + 1} • Chapter {chapterIndex + 1}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-905 dark:text-white mt-3 leading-tight">
          {chapter.name}
        </h1>
      </div>

      {/* Video Browser Mock Frame */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] w-full">
        {/* Browser Top Controls */}
        <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-3 border-b-2 border-black dark:border-zinc-800 flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 block border border-black/10" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 block border border-black/10" />
          <span className="w-3 h-3 rounded-full bg-green-400 block border border-black/10" />
          <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-4">
            Lecture Video Player
          </span>
        </div>
        
        {/* Responsive Video Container */}
        <div className="relative w-full aspect-video">
          <iframe
            title="chapter video"
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${chapter.videoId}`}
            allowFullScreen
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
        <h3 className="text-lg font-extrabold text-gray-905 dark:text-white flex items-center gap-2 border-b border-gray-150 dark:border-zinc-800 pb-3 mb-4">
          <ScrollText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Key Concepts & Summary
        </h3>
        <p className="text-gray-650 dark:text-gray-350 text-sm leading-relaxed whitespace-pre-line font-medium">
          {chapter.summary}
        </p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
