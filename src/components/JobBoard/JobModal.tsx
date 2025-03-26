
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JobItem } from "./JobCard";
import { Briefcase, MapPin, CalendarDays, Building, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface JobModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobModal = ({ job, isOpen, onClose }: JobModalProps) => {
  if (!job) return null;
  
  const { core } = job.result;
  const company = job.result.company_profile_results?.result;
  
  // Format posted date
  const formattedDate = core.posted_date 
    ? format(new Date(core.posted_date), 'MMM d, yyyy')
    : 'Recently posted';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Header section with gradient background */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
            <div className="flex items-center gap-4 mb-4">
              {/* Company Logo */}
              <div className="flex-shrink-0 w-14 h-14 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-sm border border-gray-100">
                {company?.logo?.normal_url ? (
                  <img 
                    src={company.logo.normal_url} 
                    alt={`${company.core.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {company?.core?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{core.title}</h2>
                <p className="text-gray-700 flex items-center mt-1">
                  <Building size={16} className="mr-1.5" />
                  {company?.core?.name}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{core.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase size={18} className="mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Job Type</p>
                  <p className="text-sm text-gray-600">{core.job_type || 'Full-time'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarDays size={18} className="mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Posted On</p>
                  <p className="text-sm text-gray-600">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job details section */}
          <div className="p-6">
            {/* Salary information */}
            {core.salary_range && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Salary Range</h3>
                <p className="text-gray-800 bg-green-50 text-green-800 px-3 py-1.5 inline-block rounded-md">{core.salary_range}</p>
              </div>
            )}
            
            {/* Job description */}
            {core.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{core.description}</p>
              </div>
            )}
            
            {/* Requirements */}
            {core.requirements && core.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {core.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700">{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Benefits */}
            {core.benefits && core.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {core.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Apply button */}
            <div className="mt-8 flex justify-center">
              <a 
                href={core.redirect_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="primary-button flex items-center gap-2"
              >
                <span>Apply for this position</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
