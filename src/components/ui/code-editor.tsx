"use client";

import type React from "react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

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
