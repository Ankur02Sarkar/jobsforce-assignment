import React, { JSX } from "react";

interface Block {
  text: string;
  type: string;
}

interface JobDescriptionProps {
  description: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
  // Parse the description if it's a string
  let parsedDescription;
  try {
    parsedDescription =
      typeof description === "string" ? JSON.parse(description) : description;
  } catch (error) {
    console.error("Error parsing job description:", error);
    return (
      <div className="mt-6 space-y-4 text-left text-gray-700">
        <p>{description}</p>
      </div>
    );
  }

  // If we don't have blocks or it's not an array, display raw text
  if (!parsedDescription?.blocks || !Array.isArray(parsedDescription.blocks)) {
    return (
      <div className="mt-6 space-y-4 text-left text-gray-700">
        <p>{description}</p>
      </div>
    );
  }

  // Render each block based on its type
  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case "unstyled":
        // Skip empty paragraphs
        if (!block.text.trim()) {
          return <div key={index} className="h-4"></div>;
        }
        return (
          <p key={index} className="text-gray-700">
            {block.text}
          </p>
        );

      case "unordered-list-item":
        return (
          <li key={index} className="ml-6 text-gray-700">
            {block.text}
          </li>
        );

      case "ordered-list-item":
        return (
          <li key={index} className="ml-6 list-decimal text-gray-700">
            {block.text}
          </li>
        );

      case "header-one":
        return (
          <h1 key={index} className="text-2xl font-bold text-gray-900">
            {block.text}
          </h1>
        );

      case "header-two":
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900">
            {block.text}
          </h2>
        );

      case "header-three":
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900">
            {block.text}
          </h3>
        );

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-300 pl-4 italic text-gray-700"
          >
            {block.text}
          </blockquote>
        );

      case "code-block":
        return (
          <pre
            key={index}
            className="overflow-x-auto rounded bg-gray-100 p-4 text-gray-800"
          >
            <code>{block.text}</code>
          </pre>
        );

      default:
        return (
          <p key={index} className="text-gray-700">
            {block.text}
          </p>
        );
    }
  };

  // Group list items together to create proper lists
  const renderBlocks = () => {
    const { blocks } = parsedDescription;
    const result: JSX.Element[] = [];

    let currentListType: string | null = null;
    let currentListItems: JSX.Element[] = [];

    blocks.forEach((block: Block, index: number) => {
      // Handle list items
      if (
        block.type === "unordered-list-item" ||
        block.type === "ordered-list-item"
      ) {
        // If we're starting a new list or changing list type
        if (currentListType !== block.type && currentListItems.length > 0) {
          // Finalize the previous list
          result.push(
            React.createElement(
              currentListType === "unordered-list-item" ? "ul" : "ol",
              {
                key: `list-${result.length}`,
                className: "list-disc space-y-2 mb-4",
              },
              currentListItems
            )
          );
          currentListItems = [];
        }

        // Set the current list type and add the item
        currentListType = block.type;
        currentListItems.push(renderBlock(block, index));
      } else {
        // If we were building a list and now hit a non-list item
        if (currentListItems.length > 0) {
          // Finalize the current list
          result.push(
            React.createElement(
              currentListType === "unordered-list-item" ? "ul" : "ol",
              {
                key: `list-${result.length}`,
                className: "list-disc space-y-2 mb-4",
              },
              currentListItems
            )
          );
          currentListItems = [];
          currentListType = null;
        }

        // Add the non-list item
        result.push(renderBlock(block, index));
      }
    });

    // If we have any remaining list items, finalize the list
    if (currentListItems.length > 0) {
      result.push(
        React.createElement(
          currentListType === "unordered-list-item" ? "ul" : "ol",
          {
            key: `list-${result.length}`,
            className: "list-disc space-y-2 mb-4",
          },
          currentListItems
        )
      );
    }

    return result;
  };

  return (
    <div className="job-description mt-6 space-y-4 text-left">
      {renderBlocks()}
    </div>
  );
};

export default JobDescription;
