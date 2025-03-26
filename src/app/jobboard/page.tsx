import JobBoard from "@/components/JobBoard/JobBoard";
import React from "react";

const JobBoardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container px-4 py-6 sm:py-12 mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Dream Job Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your perfect career opportunity with our streamlined job
            search platform
          </p>
        </header>

        <main>
          <JobBoard />
        </main>
      </div>
    </div>
  );
};

export default JobBoardPage;
