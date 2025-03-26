
import { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface JobSearchFormProps {
  onSearch: (keyword: string, location: string, count: number) => void;
  isLoading: boolean;
}

const JobSearchForm = ({ onSearch, isLoading }: JobSearchFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location, count);
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 mb-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Find Your Dream Job</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Input */}
          <div className="space-y-2">
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title / Keyword
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Briefcase size={18} />
              </div>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input pl-10"
                placeholder="e.g. Frontend Developer"
              />
            </div>
          </div>
          
          {/* Location Input */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <MapPin size={18} />
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input pl-10"
                placeholder="e.g. San Francisco"
              />
            </div>
          </div>
          
          {/* Count Dropdown */}
          <div className="space-y-2">
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
              Results Per Page
            </label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="search-input"
            >
              <option value={5}>5 Results</option>
              <option value={10}>10 Results</option>
              <option value={15}>15 Results</option>
              <option value={20}>20 Results</option>
              <option value={25}>25 Results</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="primary-button flex items-center justify-center gap-2 min-w-[140px]"
            aria-label="Search for jobs"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search size={18} />
                <span>Search Jobs</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSearchForm;
