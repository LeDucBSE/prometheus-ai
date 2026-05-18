import { NextResponse } from "next/server";
import {
  parseTransformRequest,
  parseTransformResponse,
} from "@/lib/transform/schemas";
import { transformPrompt } from "@/lib/transform/service";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request must be valid JSON." }, { status: 400 });
  }

  const parsedInput = parseTransformRequest(payload);
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: parsedInput.error.issues[0]?.message ?? "Invalid request payload." },
      { status: 400 }
    );
  }

  try {
    const result = await transformPrompt(parsedInput.data);
    const parsedOutput = parseTransformResponse(result);

    if (!parsedOutput.success) {
      return NextResponse.json(
        { error: "The transformation service returned an invalid response." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsedOutput.data);
  } catch (error) {
    if (error instanceof Error) {
      const status = "status" in error && typeof error.status === "number" ? error.status : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
