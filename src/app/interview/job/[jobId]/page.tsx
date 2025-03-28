"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/lib/api";

interface InterviewResponse {
  success: boolean;
  data: {
    _id: string;
  };
}

export default function JobInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrCreateInterview = async () => {
      try {
        // Call the backend endpoint to get or create an interview for this job
        const response = await apiGet<InterviewResponse>(`/api/interviews/job/${jobId}`);
        
        if (response.success && response.data._id) {
          // Redirect to the interview page with the interview ID
          router.push(`/interview/${response.data._id}`);
        } else {
          setError("Failed to create interview for this job");
        }
      } catch (error) {
        console.error("Error creating interview:", error);
        setError("An error occurred while setting up the interview");
      }
    };

    if (jobId) {
      getOrCreateInterview();
    }
  }, [jobId, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div>
            <p className="text-lg">Setting up your interview...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 