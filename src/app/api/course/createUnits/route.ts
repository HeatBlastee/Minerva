import { NextResponse } from "next/server";
import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("unauthorised", { status: 401 });
    }

    const isPro = await checkSubscription();
    if (session.user.credits <= 0 && !isPro) {
      return new NextResponse("no credits", { status: 402 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return new NextResponse("invalid title", { status: 400 });
    }

    console.log(`Generating units for course title: "${title}"`);

    const response = await strict_output(
      "You are a helpful assistant capable of curating educational course topics and subtopics. Your task is to output a JSON object containing an array of relevant units or subtopics that comprehensively cover the course title provided. Generate as many relevant units as necessary to logically and thoroughly cover the topic (usually between 4 and 10), but do not exceed 10 units. Each unit must be a short, clear, and descriptive subtopic name.",
      `Create a list of units for a course titled "${title}". Generate as many relevant units as possible to cover the topic comprehensively, with a maximum of 10 units.`,
      {
        units: "an array of strings, where each string is a concise, educational unit or subtopic name. The array length should be between 3 and 10."
      }
    );

    console.log("Generated units output:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in createUnits API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
