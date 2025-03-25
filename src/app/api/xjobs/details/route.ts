import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getTwitterJobById } from "@/controllers/twitterJobs.controller";
import { addCorsHeaders, isAllowedOrigin } from "@/lib/utils";

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  const headersList = await headers();
  const origin = headersList.get("origin");
  return addCorsHeaders(response, origin);
}

// POST handler for Twitter job details
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

    // Create custom req and res objects that mimic Express objects
    const req = {
      body
    } as any;

    let responseData: any = null;
    let statusCode = 200;

    // Create a custom response object that captures what the controller sends
    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseData = data;
        return res;
      }
    } as any;

    // Call the controller with our custom req and res objects
    await getTwitterJobById(req, res);

    // Use the response data captured by our custom res object
    const nextResponse = NextResponse.json(responseData, { status: statusCode });
    return addCorsHeaders(nextResponse, origin);
  } catch (error) {
    console.error("Error in Twitter job details API:", error);
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
