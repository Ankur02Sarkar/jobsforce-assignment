"use client";

import Editor from "@monaco-editor/react";
import type React from "react";
import { useState } from "react";
import * as monaco from "monaco-editor";

// Function to format code
export const formatCode = async (code: string, language: string): Promise<string> => {
  // If code is empty, return as is
  if (!code || code.trim() === "") {
    return code;
  }

  // Map language values to Monaco's language identifiers
  const languageMap: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
  };
  
  const monacoLanguage = languageMap[language] || "javascript";
  
  // Language-specific formatting logic
  try {
    // We'll use a language-specific approach for better results
    const lines = code.split("\n");
    let formattedLines: string[] = [];
    let indentLevel = 0;
    const indentSize = 2;
    
    // For Python which uses significant whitespace
    if (language === "python") {
      for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Empty lines stay empty
        if (trimmedLine.length === 0) {
          formattedLines.push('');
          continue;
        }
        
        // Check if this line decreases indentation (else/elif/except/finally blocks)
        if (/^(else|elif|except|finally)/.test(trimmedLine)) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Add indentation
        formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
        
        // Increase indent for lines ending with a colon
        if (trimmedLine.endsWith(':') && 
            !trimmedLine.startsWith('import') && 
            !trimmedLine.startsWith('from')) {
          indentLevel += 1;
        }
      }
    } 
    // For curly brace languages (JS, Java, C++, etc.)
    else {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Empty line handling
        if (trimmedLine.length === 0) {
          formattedLines.push('');
          continue;
        }
        
        // Decrease indent level for lines with closing braces/brackets
        const hasClosingBrace = /^[}\])]/.test(trimmedLine);
        if (hasClosingBrace) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Add the line with proper indentation
        formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
        
        // Increase indent level for lines with opening braces/brackets
        const openingBraces = (trimmedLine.match(/{|\[|\(/g) || []).length;
        const closingBraces = (trimmedLine.match(/}|\]|\)/g) || []).length;
        const netBraces = openingBraces - closingBraces;
        
        // If we have more opening braces than closing ones, increase indentation
        if (netBraces > 0) {
          indentLevel += netBraces;
        }
        
        // Special case for single-line if statements in JS-like languages
        if (!hasClosingBrace && !trimmedLine.includes('{') && 
            (trimmedLine.startsWith('if') || 
             trimmedLine.startsWith('for') || 
             trimmedLine.startsWith('while'))) {
          // Check if next line isn't a brace
          const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
          if (nextLine && !nextLine.startsWith('{')) {
            indentLevel += 1;
          }
        }
      }
    }
    
    return formattedLines.join('\n');
  } catch (error) {
    console.error("Error formatting code:", error);
    return code;
  }
};

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = "Enter your code here...",
  className = "",
  style = {},
  readOnly = false,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Map language values to Monaco's language identifiers
  const getMonacoLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      java: "java",
      cpp: "cpp",
    };

    return languageMap[lang] || "javascript";
  };

  // Handle editor initialization
  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  // Handle value change
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <div className={`relative font-mono text-sm ${className}`} style={style}>
      <Editor
        height="100%"
        width="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          scrollbar: {
            useShadows: false,
          },
          readOnly: readOnly,
        }}
      />

      {!isEditorReady && !value && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
