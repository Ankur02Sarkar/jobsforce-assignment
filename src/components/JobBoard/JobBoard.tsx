"use client";
import { apiPost } from "@/lib/api";
import { useLoading } from "@/lib/useLoading";
import { ExternalLink, MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { Briefcase } from "lucide-react";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import JobSearchForm from "./JobSearchForm";

interface JobCore {
  title: string;
  location: string;
  redirect_url: string;
}

interface JobItem {
  id: string;
  rest_id: string;
  result: {
    __typename: string;
    __isJobResult: string;
    id: string;
    core: JobCore;
    company_profile_results: {
      id: string;
      rest_id: string;
      result: {
        __typename: string;
        id: string;
        rest_id: string;
        core: {
          name: string;
        };
        logo: {
          normal_url: string;
        };
      };
    };
  };
}

interface JobsResponse {
  data: {
    data: {
      job_search: {
        items_results: JobItem[];
      };
    };
  };
}

const JobBoard = () => {
  const { withLoading, isLoading } = useLoading();
  const [allJobs, setAllJobs] = useState<JobItem[]>([]);

  // State for form inputs
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(5);

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // State for API response
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null);

  const handleSearch = async (
    keyword: string,
    location: string,
    count: number,
  ) => {
    setKeyword(keyword);
    setLocation(location);
    setCount(count);

    const payload = {
      count,
      cursor: null,
      keyword,
      job_location_id: null,
      job_location: location,
      job_location_type: [],
      seniority_level: [],
      company_name: null,
      employment_type: [],
      industry: null,
    };

    try {
      await withLoading(async () => {
        const response = await apiPost<JobsResponse>("/api/xjobs", payload);
        setJobs(response?.data?.data?.job_search?.items_results);
        setJobsData(response);
        setHasSearched(true);
        return response;
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs. Please try again.");
    }
  };

  const handleJobClick = (job: JobItem) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    // <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
    //   <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-100">
    //     <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Find Your Dream Job</h2>

    //     <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         {/* Keyword Input */}
    //         <div className="space-y-2">
    //           <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
    //             Job Title / Keyword
    //           </label>
    //           <input
    //             id="keyword"
    //             type="text"
    //             value={keyword}
    //             onChange={(e) => setKeyword(e.target.value)}
    //             className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    //             placeholder="e.g. Backend Developer"
    //           />
    //         </div>

    //         {/* Location Input */}
    //         <div className="space-y-2">
    //           <label htmlFor="location" className="block text-sm font-medium text-gray-700">
    //             Location
    //           </label>
    //           <input
    //             id="location"
    //             type="text"
    //             value={location}
    //             onChange={(e) => setLocation(e.target.value)}
    //             className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    //             placeholder="e.g. Pune"
    //           />
    //         </div>

    //         {/* Count Dropdown */}
    //         <div className="space-y-2">
    //           <label htmlFor="count" className="block text-sm font-medium text-gray-700">
    //             Results Per Page
    //           </label>
    //           <select
    //             id="count"
    //             value={count}
    //             onChange={(e) => setCount(Number(e.target.value))}
    //             className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    //           >
    //             <option value={5}>5</option>
    //             <option value={10}>10</option>
    //             <option value={15}>15</option>
    //             <option value={20}>20</option>
    //             <option value={25}>25</option>
    //           </select>
    //         </div>
    //       </div>

    //       <div className="flex justify-center sm:justify-end">
    //         <button
    //           type="submit"
    //           className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
    //           aria-label="Search for jobs"
    //         >
    //           <Search size={18} />
    //           <span>Search Jobs</span>
    //         </button>
    //       </div>
    //     </form>

    //     {/* Job Results Section */}
    //     {allJobs.length > 0 && (
    //       <div className="mt-8">
    //         <h3 className="text-lg font-medium text-gray-900 mb-4">Job Listings ({allJobs.length})</h3>

    //         <div className="space-y-4">
    //           {allJobs.map((job) => (
    //             <div
    //               key={job.id}
    //               className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    //             >
    //               <div className="flex items-start gap-4">
    //                 {/* Company Logo */}
    //                 <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
    //                   {job.result.company_profile_results?.result?.logo ? (
    //                     <img
    //                       src={job.result.company_profile_results.result.logo.normal_url}
    //                       alt={`${job.result.company_profile_results.result.core.name} logo`}
    //                       className="w-full h-full object-contain"
    //                     />
    //                   ) : (
    //                     <div className="text-xl font-bold text-gray-400">
    //                       {job.result.company_profile_results?.result?.core?.name?.charAt(0) || '?'}
    //                     </div>
    //                   )}
    //                 </div>

    //                 {/* Job Details */}
    //                 <div className="flex-1 min-w-0">
    //                   <h4 className="text-base font-semibold text-blue-600 truncate">
    //                     {job.result.core.title}
    //                   </h4>

    //                   <p className="text-sm font-medium text-gray-800 mt-1">
    //                     {job.result.company_profile_results?.result?.core?.name}
    //                   </p>

    //                   <div className="flex items-center mt-1 text-sm text-gray-600">
    //                     <MapPin size={14} className="mr-1 flex-shrink-0" />
    //                     <span>{job.result.core.location}</span>
    //                   </div>
    //                 </div>

    //                 {/* Apply Button */}
    //                 <a
    //                   href={job.result.core.redirect_url}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
    //                 >
    //                   <ExternalLink size={14} className="mr-1" />
    //                   View
    //                 </a>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     )}

    //     {allJobs.length === 0 && jobsData && (
    //       <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-md text-center">
    //         <p className="text-sm text-gray-600">No jobs found. Try different search terms.</p>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <JobSearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Job Results Section */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Briefcase className="mr-2 text-primary" size={20} />
              <span>Job Listings</span>
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({jobs.length} results)
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => handleJobClick(job)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {jobs.length === 0 && hasSearched && (
        <div className="mt-10 text-center py-12 px-4 bg-gray-50 rounded-xl border border-gray-100">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No jobs found
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            We couldn&apos;t find any jobs matching your search criteria. Try
            adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Job Modal */}
      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default JobBoard;
