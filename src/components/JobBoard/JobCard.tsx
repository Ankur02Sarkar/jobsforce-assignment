import { formatDistanceToNow } from "date-fns";
import { MapPin, Briefcase, ExternalLink, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export interface JobItem {
  id: string;
  rest_id: string;
  result: {
    __typename: string;
    __isJobResult: string;
    id: string;
    core: {
      title: string;
      location: string;
      redirect_url: string;
      job_type?: string;
      salary_range?: string;
      description?: string;
      requirements?: string[];
      benefits?: string[];
      posted_date?: string;
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
}

interface JobCardProps {
  job: JobItem;
  onClick: () => void;
}

const JobCard = ({ job, onClick }: JobCardProps) => {
  const { core } = job.result;
  const company = job.result.company_profile_results?.result;
  const router = useRouter();

  // Format posted date if available
  const formattedDate = core.posted_date
    ? formatDistanceToNow(new Date(core.posted_date), { addSuffix: true })
    : "Recently";

  // Determine job type badge color
  const getJobTypeBadgeClass = () => {
    if (!core.job_type) return "badge-blue";

    switch (core.job_type.toLowerCase()) {
      case "full-time":
        return "badge-blue";
      case "part-time":
        return "badge-green";
      case "contract":
        return "badge-amber";
      case "remote":
        return "badge-purple";
      default:
        return "badge-blue";
    }
  };

  return (
    <div className="job-card animate-scale-in" onClick={onClick}>
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
          {company?.logo?.normal_url ? (
            <img
              src={company.logo.normal_url}
              alt={`${company.core.name} logo`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-xl font-bold text-gray-400">
              {company?.core?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${getJobTypeBadgeClass()}`}>
              {core.job_type || "Full-time"}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-primary truncate">
            {core.title}
          </h3>

          <p className="text-sm font-medium text-gray-800 mt-1">
            {company?.core?.name}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{core.location}</span>
            </div>

            {core.salary_range && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="hidden sm:inline mx-2 text-gray-300">•</span>
                <span>{core.salary_range}</span>
              </div>
            )}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(core.redirect_url, "_blank", "noopener,noreferrer");
          }}
          className="inline-flex items-center px-3 py-1.5 bg-blue-400/10 text-blue-500 text-sm font-medium rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
        >
          <ExternalLink size={14} className="mr-1 cursor-pointer" />
          Apply
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (job.rest_id) {
              router.push(`/interview/${job.rest_id}`);
            }
          }}
          className="inline-flex items-center px-3 py-1.5 bg-green-400/10 text-green-500 text-sm font-medium rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
        >
          <ExternalLink size={14} className="mr-1 cursor-pointer" />
          AI Interview
        </button>
      </div>
    </div>
  );
};

export default JobCard;
