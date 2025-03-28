"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { JobItem } from "./JobCard";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  Building,
  ExternalLink,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import JobDescription from "./JobDescription";
import Image from "next/image";
import CompanyLogo from "./CompanyLogo";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface JobModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface JobDetailsResponse {
  data: {
    data: {
      jobData: {
        id: string;
        rest_id: string;
        result: {
          __typename: string;
          id: string;
          core: {
            title: string;
            external_url: string;
            featured: number;
            job_description: string;
            job_page_url: string;
            location: string;
          };
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
      };
      viewer: {
        user_results: {
          result: {
            __typename: string;
            id: string;
          };
          id: string;
        };
      };
    };
  };
}

const JobModal = ({ job, isOpen, onClose }: JobModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetailsResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (job?.rest_id) {
      getCurrentJobInfo(job.rest_id);
    }
  }, [job]);

  const getCurrentJobInfo = async (jobId: string) => {
    const payload = {
      jobId: jobId,
      loggedIn: true,
    };

    try {
      setIsLoading(true);
      const response = await apiPost<JobDetailsResponse>(
        "/api/xjobs/details",
        payload,
      );
      setJobDetails(response);
      return response.data.data;
    } catch (error: unknown) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) return null;

  const { core } = job.result;
  // const company = job.result.company_profile_results?.result;

  // Format posted date
  const formattedDate = core.posted_date
    ? format(new Date(core.posted_date), "MMM d, yyyy")
    : "Recently posted";

  const title = jobDetails?.data?.data?.jobData?.result?.core?.title ?? "";
  const company =
    jobDetails?.data?.data?.jobData?.result?.company_profile_results?.result
      ?.core?.name ?? "";
  const location =
    jobDetails?.data?.data?.jobData?.result?.core?.location ?? "";
  const externalUrl =
    jobDetails?.data?.data?.jobData?.result?.core?.external_url ?? "";
  const logoUrl =
    jobDetails?.data?.data?.jobData?.result?.company_profile_results?.result
      ?.logo?.normal_url ?? "";
  const jobDescription =
    jobDetails?.data?.data?.jobData?.result?.core?.job_description ?? "";

  const logoColors = [
    "#F87171",
    "#60A5FA",
    "#34D399",
    "#A78BFA",
    "#FBBF24",
    "#EC4899",
  ];
  const logoColor = logoColors[Math.floor(Math.random() * logoColors.length)];

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden w-full !max-w-[70vw]"
        hideClose={true}
      >
        <div
          className="flex items-center justify-center bg-white rounded-xl p-6 w-full max-w-[70vw] overflow-y-auto"
          onClick={handleModalClick}
        >
          <div className="w-full">
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-scroll">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      width={80}
                      height={80}
                      alt={company}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <CompanyLogo
                      company={company}
                      size="lg"
                      color={logoColor}
                    />
                  )}
                </div>

                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {title}
                </h1>

                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-gray-600">
                  {company && (
                    <div className="flex items-center">
                      <Building className="mr-2" size={20} />
                      <span className="font-medium">{company}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center">
                      <MapPin className="mr-2" size={20} />
                      <span className="font-medium">{location}</span>
                    </div>
                  )}
                </div>

                {!isLoading && (
                  <div className="flex flex-row gap-3 items-center w-full justify-center">
                    {externalUrl && (
                      <Button
                        onClick={() => {
                          if (externalUrl) {
                            window.open(externalUrl, "_blank");
                          }
                        }}
                        disabled={!externalUrl}
                        rel="noopener noreferrer"
                        className="w-fit cursor-pointer max-w-md transform rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Apply Now
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        if (job.rest_id) {
                          router.push(`/interview/job/${job.rest_id}`);
                        }
                      }}
                      disabled={!job.rest_id}
                      rel="noopener noreferrer"
                      className="w-fit cursor-pointer max-w-md transform rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      AI Interview
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t pt-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Job Description
                </h2>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <JobDescription description={jobDescription} />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
