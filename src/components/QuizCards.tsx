"use client";

import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ChevronRight, Award, HelpCircle, Check, X } from "lucide-react";

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [questionState, setQuestionState] = React.useState<
    Record<string, boolean | null>
  >({});

  const checkAnswer = React.useCallback(() => {
    const newQuestionState = { ...questionState };
    chapter.questions.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;
      if (user_answer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
    });
    setQuestionState(newQuestionState);
  }, [answers, questionState, chapter.questions]);

  if (chapter.questions.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
      <h2 className="text-lg font-extrabold text-gray-905 dark:text-white flex items-center gap-2 border-b border-gray-150 dark:border-zinc-800 pb-3 mb-4">
        <Award className="w-5 h-5 text-violet-650" />
        Concept Check
      </h2>

      <div className="space-y-6">
        {chapter.questions.map((question, qIdx) => {
          const options = JSON.parse(question.options) as string[];
          const isCorrect = questionState[question.id] === true;
          const isWrong = questionState[question.id] === false;
          
          return (
            <div
              key={question.id}
              className={cn(
                "p-4 border-2 rounded-xl transition-all duration-305 flex flex-col gap-3",
                {
                  "border-gray-250 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20": !isCorrect && !isWrong,
                  "border-green-400 dark:border-green-900 bg-green-50/20 dark:bg-green-950/10": isCorrect,
                  "border-red-400 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10": isWrong,
                }
              )}
            >
              {/* Question Header */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500">
                  Question {qIdx + 1}
                </span>
                
                {isCorrect && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" /> Correct
                  </span>
                )}
                {isWrong && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
                    <X className="w-2.5 h-2.5" /> Incorrect
                  </span>
                )}
              </div>

              {/* Question text */}
              <h4 className="text-sm font-bold text-gray-805 dark:text-zinc-200 leading-snug">
                {question.question}
              </h4>

              {/* Options Radio List */}
              <div className="mt-1">
                <RadioGroup
                  onValueChange={(val) => {
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: val,
                    }));
                  }}
                  value={answers[question.id]}
                  className="space-y-2"
                >
                  {options.map((option, index) => {
                    const optId = `${question.id}-${index}`;
                    return (
                      <div 
                        className={cn(
                          "flex items-center space-x-3 p-2.5 rounded-lg border transition-all cursor-pointer",
                          answers[question.id] === option
                            ? "border-black dark:border-zinc-650 bg-white dark:bg-zinc-800"
                            : "border-gray-200 dark:border-zinc-800/80 hover:border-black dark:hover:border-zinc-700"
                        )}
                        key={index}
                        onClick={() => {
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option,
                          }));
                        }}
                      >
                        <RadioGroupItem
                          value={option}
                          id={optId}
                          onClick={(e) => e.stopPropagation()} // Prevent double clicks
                          className="flex-shrink-0"
                        />
                        <Label 
                          htmlFor={optId}
                          onClick={(e) => e.stopPropagation()} // Prevent double clicks
                          className="flex-1 cursor-pointer py-0.5 text-xs font-bold text-gray-650 dark:text-zinc-350 select-none"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>

      {/* Check Answer Action */}
      <button
        onClick={checkAnswer}
        className="w-full mt-6 py-3.5 font-black text-black bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        Check Answers
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuizCards;
