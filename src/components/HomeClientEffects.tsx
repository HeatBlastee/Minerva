"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Video, 
  Award, 
  Zap, 
  Play,
  RotateCcw,
  BookOpenCheck
} from "lucide-react";

const SAMPLE_COURSES = {
  quantum: {
    title: "Quantum Computing Basics",
    units: [
      {
        name: "Unit 1: Foundations of Quantum Physics",
        chapters: [
          { name: "Superposition & Wave Functions", duration: "6 mins", icon: Video },
          { name: "Quantum Entanglement & Spooky Action", duration: "8 mins", icon: Video },
          { name: "Dirac Notation & Qubit Math", duration: "5 mins", icon: HelpCircle }
        ]
      },
      {
        name: "Unit 2: Quantum Algorithms",
        chapters: [
          { name: "Deutsch-Jozsa & Grover's Search", duration: "10 mins", icon: Video },
          { name: "Shor's Factoring Algorithm", duration: "12 mins", icon: HelpCircle }
        ]
      }
    ]
  },
  art: {
    title: "Renaissance Art & History",
    units: [
      {
        name: "Unit 1: The Italian Masters",
        chapters: [
          { name: "Brunelleschi's Dome & Linear Perspective", duration: "7 mins", icon: Video },
          { name: "Michelangelo & The Sistine Chapel", duration: "9 mins", icon: Video },
          { name: "Da Vinci's Notebooks & SFumato", duration: "6 mins", icon: HelpCircle }
        ]
      },
      {
        name: "Unit 2: Northern Renaissance",
        chapters: [
          { name: "Jan van Eyck & Oil Painting Mastery", duration: "8 mins", icon: Video },
          { name: "Albrecht Dürer's Woodcuts", duration: "6 mins", icon: HelpCircle }
        ]
      }
    ]
  },
  pastries: {
    title: "French Pastry Masterclass",
    units: [
      {
        name: "Unit 1: Viennoiserie & Lamination",
        chapters: [
          { name: "The Perfect Croissant Dough", duration: "12 mins", icon: Video },
          { name: "Butter Lamination & Layering Techniques", duration: "10 mins", icon: Video },
          { name: "Proofing & Baking for Golden Flakiness", duration: "8 mins", icon: HelpCircle }
        ]
      },
      {
        name: "Unit 2: Custards & Creams",
        chapters: [
          { name: "Crème Pâtissière & Variations", duration: "7 mins", icon: Video },
          { name: "Macaron Shell Piping & Aging", duration: "9 mins", icon: HelpCircle }
        ]
      }
    ]
  }
};

type TopicKey = keyof typeof SAMPLE_COURSES;

export default function HomeClientEffects() {
  const [selectedTopic, setSelectedTopic] = useState<TopicKey>("quantum");
  const [status, setStatus] = useState<"idle" | "generating" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing syllabus & structuring topics...",
    "Retrieving high-quality YouTube lectures...",
    "Extracting transcripts & generating summaries...",
    "Drafting adaptive multi-choice quizzes..."
  ];

  const handleGenerate = () => {
    setStatus("generating");
    setProgress(0);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (status !== "generating") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        
        // Progress boundaries for steps
        if (next >= 100) {
          clearInterval(interval);
          setStatus("complete");
          return 100;
        }

        // Increment steps based on progress
        const stepIndex = Math.min(Math.floor(next / 25), steps.length - 1);
        setCurrentStep(stepIndex);

        return next;
      });
    }, 45); // ~4.5 seconds total

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 px-4">
      <div className="text-center mb-8">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-950/50 rounded-full border border-violet-300 dark:border-violet-800">
          Interactive Demo
        </span>
        <h2 className="text-3xl font-black mt-2 tracking-tight text-gray-900 dark:text-white">
          See Minerva In Action
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Choose a subject below, trigger our simulated AI generator, and watch how Minerva crafts custom structures.
        </p>
      </div>

      {/* Grid wrapper for interactive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              1. Choose a Topic
            </h3>
            <div className="space-y-3">
              {(Object.keys(SAMPLE_COURSES) as TopicKey[]).map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    if (status !== "generating") {
                      setSelectedTopic(topic);
                      setStatus("idle");
                    }
                  }}
                  disabled={status === "generating"}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    selectedTopic === topic
                      ? "border-black dark:border-white bg-violet-50 dark:bg-violet-950/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-600 bg-transparent"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {SAMPLE_COURSES[topic].title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {topic === "quantum" && "Physics & Computing"}
                      {topic === "art" && "History & Visual Arts"}
                      {topic === "pastries" && "Baking & Techniques"}
                    </span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${selectedTopic === topic ? "translate-x-1" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500 fill-violet-200" />
              2. Launch AI Generator
            </h3>
            {status === "idle" && (
              <button
                onClick={handleGenerate}
                className="w-full py-4 text-center font-black text-black dark:text-white bg-violet-400 dark:bg-violet-600 hover:bg-violet-500 dark:hover:bg-violet-500 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Generate Course Structure
              </button>
            )}

            {status === "generating" && (
              <div className="space-y-4">
                <div className="h-6 w-full bg-gray-100 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-violet-500 dark:bg-violet-400"
                    style={{ width: `${progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-black dark:text-white">
                    {progress}%
                  </span>
                </div>
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                        idx < currentStep
                          ? "text-green-600 dark:text-green-400 font-medium"
                          : idx === currentStep
                          ? "text-violet-600 dark:text-violet-400 font-bold animate-pulse"
                          : "text-gray-400 dark:text-zinc-600"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          idx < currentStep
                            ? "fill-green-100 dark:fill-green-950/30"
                            : "stroke-gray-300 dark:stroke-zinc-700"
                        }`}
                      />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === "complete" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <CheckCircle2 className="w-5 h-5 fill-green-100 dark:fill-green-950/30" />
                  <span>Syllabus Generated Successfully!</span>
                </div>
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 text-sm font-bold border-2 border-black dark:border-zinc-700 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Regenerate Demo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Mockup Showcase */}
        <div className="lg:col-span-7 min-h-[420px] flex flex-col bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-zinc-700 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] overflow-hidden relative">
          
          {/* Mock Browser Header */}
          <div className="bg-white dark:bg-zinc-900 px-4 py-3 border-b-2 border-black dark:border-zinc-700 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
              <span className="w-3 h-3 rounded-full bg-green-400 block" />
            </div>
            <div className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-500 px-8 py-1 rounded border border-gray-200 dark:border-zinc-700 w-1/2 text-center truncate">
              minerva.ai/course/{selectedTopic}
            </div>
            <div className="w-12" />
          </div>

          {/* Page Display Body */}
          <div className="flex-1 p-6 overflow-y-auto relative">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center text-violet-500 border border-violet-200 dark:border-violet-800 mb-4 animate-bounce">
                    <BookOpenCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-zinc-200">Ready to Generate</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                    Click "Generate Course Structure" on the left to see the course syllabus generate in real-time.
                  </p>
                </motion.div>
              )}

              {status === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-violet-600 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-violet-600 dark:text-violet-400 animate-pulse">
                      Generating Course Material
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Creating high-quality learning assets...
                    </p>
                  </div>
                </motion.div>
              )}

              {status === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-violet-500 uppercase tracking-widest">COURSE SKELETON</h4>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                        {SAMPLE_COURSES[selectedTopic].title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-900 rounded-full text-yellow-800 dark:text-yellow-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 fill-yellow-300 stroke-yellow-700" />
                      <span>AI Powered</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {SAMPLE_COURSES[selectedTopic].units.map((unit, uIdx) => (
                      <div
                        key={uIdx}
                        className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none"
                      >
                        <h5 className="font-extrabold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <span className="w-5 h-5 text-xs bg-violet-600 text-white rounded-full flex items-center justify-center font-bold">
                            {uIdx + 1}
                          </span>
                          {unit.name}
                        </h5>
                        <div className="space-y-2">
                          {unit.chapters.map((chap, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-950/40 hover:bg-gray-100 dark:hover:bg-zinc-950 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {chap.icon === Video ? (
                                  <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/30">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900/30">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                                  {chap.name}
                                </span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-bold">
                                {chap.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
