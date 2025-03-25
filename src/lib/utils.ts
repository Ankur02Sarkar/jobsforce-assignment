import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextRequest, NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CORS headers configuration
export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://jobs-force.vercel.app",
  "https://jobsforce-assignment-eight.vercel.app",
];

// Helper function to check if origin is allowed
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return allowedOrigins.some((allowedOrigin) => {
    if (typeof allowedOrigin === "string") {
      return allowedOrigin === origin;
    }
    return false;
  });
}

// Helper function to add CORS headers
export function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (!origin || isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return response;
}
