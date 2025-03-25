import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getTwitterJobs } from "@/controllers/twitterJobs.controller";
import { addCorsHeaders, isAllowedOrigin } from "@/lib/utils";

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  const headersList = await headers();
  const origin = headersList.get("origin");
  return addCorsHeaders(response, origin);
}

// POST handler for Twitter jobs search
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Check if origin is allowed
    if (origin && !isAllowedOrigin(origin)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: "CORS_ERROR",
            message: `Origin ${origin} not allowed by CORS`,
          },
        }),
        { status: 403 }
      );
    }

    const body = await request.json();
    const response = await getTwitterJobs(body);

    const nextResponse = NextResponse.json(response);
    return addCorsHeaders(nextResponse, origin);
  } catch (error) {
    console.error("Error in Twitter jobs API:", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      },
      { status: 500 }
    );
    const headersList = await headers();
    const origin = headersList.get("origin");
    return addCorsHeaders(errorResponse, origin);
  }
}
