import { compileQuotes } from "@/lib/quoteiq/pipeline";
import type { CompileRequest } from "@/lib/quoteiq/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CompileRequest;
    if (
      !payload.rfqId ||
      !payload.rfqLines?.length ||
      !payload.artifacts?.length
    ) {
      return Response.json(
        { error: "rfqId, rfqLines and artifacts are required." },
        { status: 400 },
      );
    }
    return Response.json(await compileQuotes(payload));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Compilation failed." },
      { status: 500 },
    );
  }
}
