"use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChaptersSchema } from "@/validators/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import SubscriptionAction from "./SubscriptionAction";

type Props = { isPro: boolean };

type Input = z.infer<typeof createChaptersSchema>;

const CreateCourseForm = ({ isPro }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isGeneratingUnits, setIsGeneratingUnits] = React.useState(false);
  const [unitKeys, setUnitKeys] = React.useState<string[]>(["key0", "key1", "key2"]);
  const [loadingStep, setLoadingStep] = React.useState(0);

  const loadingStatusText = [
    "Consulting our AI models...",
    "Drafting the perfect curriculum structure...",
    "Aligning subtopics with units...",
    "Retrieving reference content details...",
    "Putting the final touches on your custom course..."
  ];

  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async ({ title, units }: Input) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        units,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  const unitsCount = form.watch("units")?.length || 0;
  
  React.useEffect(() => {
    if (unitKeys.length !== unitsCount) {
      setUnitKeys((prev) => {
        if (prev.length < unitsCount) {
          const added = Array.from(
            { length: unitsCount - prev.length },
            (_, i) => `key-${Date.now()}-${prev.length + i}`
          );
          return [...prev, ...added];
        } else {
          return prev.slice(0, unitsCount);
        }
      });
    }
  }, [unitsCount, unitKeys.length]);

  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingStatusText.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const removeUnit = (index: number) => {
    const currentUnits = form.watch("units");
    setUnitKeys((prev) => prev.filter((_, i) => i !== index));
    form.setValue("units", currentUnits.filter((_, i) => i !== index));
  };

  const handleGenerateUnits = async () => {
    const titleValue = form.getValues("title");
    if (!titleValue || titleValue.trim().length < 3) {
      toast({
        title: "Error",
        description: "Please enter a course title (at least 3 characters) first",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingUnits(true);
    try {
      const response = await axios.post("/api/course/createUnits", {
        title: titleValue,
      });
      const generatedUnits = response.data.units;
      if (Array.isArray(generatedUnits) && generatedUnits.length > 0) {
        setUnitKeys(generatedUnits.map((_, i) => `key-${Date.now()}-${i}`));
        form.setValue("units", generatedUnits);
        toast({
          title: "Success",
          description: `Generated ${generatedUnits.length} units matching "${titleValue}"!`,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data === "no credits"
        ? "You do not have enough credits to generate units. Please upgrade your subscription."
        : "Failed to generate units. Please try again later or add them manually.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingUnits(false);
    }
  };

  function onSubmit(data: Input) {
    if (data.units.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one unit/subtopic to generate the course",
        variant: "destructive",
      });
      return;
    }
    if (data.units.some((unit) => unit === "")) {
      toast({
        title: "Error",
        description: "Please fill all the units",
        variant: "destructive",
      });
      return;
    }
    createChapters(data, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created successfully",
        });
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }

  form.watch();

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of the course"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          {/* AI Unit Generation Button */}
          <div className="flex flex-col items-start w-full sm:items-center sm:flex-row mt-3">
            <div className="flex-[1]" />
            <div className="flex-[6] w-full flex justify-end">
              <button
                type="button"
                disabled={isGeneratingUnits || isLoading}
                onClick={handleGenerateUnits}
                className="w-full sm:w-auto font-black text-black bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 px-6 py-2.5 disabled:opacity-50 text-sm"
              >
                {isGeneratingUnits ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Generating subtopics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black fill-black/25 animate-pulse" />
                    Generate Units with AI
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {form.watch("units").map((_, index) => {
              const key = unitKeys[index] || `key-${index}`;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    height: { duration: 0.2 },
                  }}
                  className="mt-4"
                >
                  <FormField
                    control={form.control}
                    name={`units.${index}`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row gap-2">
                          <FormLabel className="flex-[1] text-xl min-w-[80px]">
                            Unit {index + 1}
                          </FormLabel>
                          <div className="flex-[6] flex items-center w-full gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder="Enter subtopic of the course"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 h-10 w-10 flex-shrink-0"
                              onClick={() => removeUnit(index)}
                              title="Delete unit"
                            >
                              <Trash className="w-5 h-5" />
                            </Button>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="flex items-center justify-center mt-6">
            <Separator className="flex-[1]" />
            <div className="mx-4">
              <Button
                type="button"
                variant="secondary"
                className="font-semibold transition-all hover:bg-secondary/80 flex items-center gap-2"
                onClick={() => {
                  const currentUnits = form.watch("units");
                  setUnitKeys([...unitKeys, `key-${Date.now()}`]);
                  form.setValue("units", [...currentUnits, ""]);
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 text-green-500" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          
          <button
            disabled={isLoading || isGeneratingUnits}
            type="submit"
            className="w-full mt-6 py-3.5 font-black text-black bg-violet-400 hover:bg-violet-500 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Lets Go!
          </button>
        </form>
      </Form>
      {!isPro && <SubscriptionAction />}

      {/* Full-screen Course Creation Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] text-center max-w-sm mx-4"
            >
              <div className="relative mb-6 flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-violet-600 dark:text-violet-400" />
                <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500 absolute animate-pulse" />
              </div>
              <h3 className="text-xl font-black mb-2 text-gray-900 dark:text-white">
                Generating Course...
              </h3>
              <p className="text-sm font-bold text-violet-600 dark:text-violet-400 min-h-[40px] px-4 flex items-center justify-center text-center">
                {loadingStatusText[loadingStep]}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-150 dark:border-zinc-800 text-xs text-gray-500 dark:text-gray-450 font-medium leading-relaxed">
                This process calls our AI models and takes about 10-20 seconds. Please do not close or reload this tab.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCourseForm;
