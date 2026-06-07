// /api/chapter/getInto

import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId || "");
    let maxLength = 350;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    console.log("Chapter getInfo - search completed", {
      chapterId,
      videoId,
      transcriptLength: transcript.length,
    });

    if (!videoId) {
      console.log("No video found for chapter:", chapterId);
      const questions = await getQuestionsFromTranscript(
        "No transcript available.",
        chapter.name
      );
      await prisma.question.createMany({
        data: questions.map((question) => {
          let options = [
            question.answer,
            question.option1,
            question.option2,
            question.option3,
          ];
          options = options.sort(() => Math.random() - 0.5);
          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            chapterId: chapterId,
          };
        }),
      });
      await prisma.chapter.update({
        where: { id: chapterId },
        data: {
          videoId: "",
          summary: "No video found for this chapter.",
        },
      });
      return NextResponse.json({ success: true });
    }

    if (!transcript) {
      console.log("No transcript found for chapter:", chapterId);
      const questions = await getQuestionsFromTranscript(
        "No transcript available.",
        chapter.name
      );
      await prisma.question.createMany({
        data: questions.map((question) => {
          let options = [
            question.answer,
            question.option1,
            question.option2,
            question.option3,
          ];
          options = options.sort(() => Math.random() - 0.5);
          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            chapterId: chapterId,
          };
        }),
      });
      await prisma.chapter.update({
        where: { id: chapterId },
        data: {
          videoId: videoId,
          summary: "No transcript available for this video.",
        },
      });
      return NextResponse.json({ success: true });
    }

    const { summary }: { summary: string } = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
        transcript,
      { summary: "summary of the transcript" }
    );

    console.log("Chapter getInfo - summary generated", { chapterId });

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    console.log("Chapter getInfo - questions generated", {
      chapterId,
      questionsCount: questions.length,
    });

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    console.log("Chapter getInfo - successfully finished", { chapterId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in chapter getInfo:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "unknown",
        },
        { status: 500 }
      );
    }
  }
}
