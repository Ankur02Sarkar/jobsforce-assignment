"use client";

import { apiGet, apiPost } from "@/lib/api";
import { CalendarIcon, ClockIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Interview type definition based on backend model
interface Interview {
  _id: string;
  title: string;
  date: string;
  status: "scheduled" | "pending" | "completed";
  duration: number;
  questions?: Array<{
    question: string;
    answer?: string;
    score?: number;
  }>;
  feedback?: string;
  createdAt: string;
}

// API response type
interface InterviewsResponse {
  success: boolean;
  count: number;
  data: Interview[];
}

const InterviewPage = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch all interviews when component mounts
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await apiGet<InterviewsResponse>("/api/interviews");

        if (response.success) {
          setInterviews(response.data);
        } else {
          setError("Failed to load interviews");
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setError("An error occurred while fetching interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleNewInterview = async () => {
    try {
      setLoading(true);

      // Create a new interview
      const response = await apiPost<{ success: boolean; data: Interview }>(
        "/api/interviews",
        {
          title: `Mock Interview - ${new Date().toLocaleDateString()}`,
          date: new Date().toISOString(),
          status: "pending",
          duration: 60,
        },
      );

      if (response.success) {
        // Navigate to the new interview page
        router.push(`/interview/${response.data._id}`);
      } else {
        // If the interview creation failed, we'll show an error
        setError("Failed to create new interview");
      }
    } catch (error) {
      console.error("Failed to create interview:", error);
      setError("Failed to create new interview");

      // For development/demo: If creating interview fails, still navigate to mock questions
      // with a default interview ID - REMOVE THIS IN PRODUCTION
      if (typeof window !== "undefined") {
        localStorage.setItem("currentInterviewId", "67e5c71fdf9dfab5839347e5"); // Use a known valid ID
        router.push("/interview/67e5c71fdf9dfab5839347e5");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Interviews</h1>
        <button
          onClick={handleNewInterview}
          disabled={loading}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Mock Interview
        </button>
      </div>

      {loading && <p className="text-center py-8">Loading interviews...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && interviews.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">
            You haven&apos;t taken any interviews yet
          </p>
          <button
            onClick={handleNewInterview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Start Your First Interview
          </button>
        </div>
      )}

      {!loading && !error && interviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              href={`/interview/${interview._id}`}
              className="block bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(interview.status)}`}
                  >
                    {interview.status.charAt(0).toUpperCase() +
                      interview.status.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">{interview.duration} min</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {interview.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {new Date(interview.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
