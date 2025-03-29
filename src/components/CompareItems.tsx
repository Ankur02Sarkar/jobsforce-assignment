import React from "react";
import { Compare } from "@/components/ui/compare";
import { CodeCompare } from "@/components/ui/code-compare";

interface CompareItemsProps {
  type?: "code" | "image";
  firstItem?: string;
  secondItem?: string;
  language?: string;
}

const CompareItems: React.FC<CompareItemsProps> = ({
  type = "image",
  firstItem,
  secondItem,
  language = "javascript",
}) => {
  if (type === "code" && firstItem && secondItem) {
    return (
      <div className="border rounded-lg dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <CodeCompare
          firstCode={firstItem}
          secondCode={secondItem}
          language={language}
          className="h-[400px] md:h-[500px] w-full"
          slideMode="hover"
        />
      </div>
    );
  }

  // Default to image comparison
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage={firstItem || "https://assets.aceternity.com/code-problem.png"}
        secondImage={secondItem || "https://assets.aceternity.com/code-solution.png"}
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
};

export default CompareItems;
