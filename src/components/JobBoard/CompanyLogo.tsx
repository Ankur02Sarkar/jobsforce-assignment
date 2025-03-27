import type React from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  company: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  size = "md",
  color = "#3B82F6",
  className,
}) => {
  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const firstLetter = company.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md font-bold text-white",
        sizeClass[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {firstLetter}
    </div>
  );
};

export default CompanyLogo;
