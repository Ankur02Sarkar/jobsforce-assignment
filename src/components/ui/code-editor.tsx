"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
};

// Basic syntax highlighting patterns
const highlightPatterns = {
  javascript: {
    keywords:
      /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|from|try|catch|finally|throw|async|await)\b/g,
    strings: /(["'`])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  python: {
    keywords:
      /\b(def|if|else|elif|for|while|return|import|from|as|class|try|except|finally|with|in|not|and|or|is|None|True|False|pass|break|continue|raise|assert|global|nonlocal|lambda)\b/g,
    strings: /(["'`])(\\?.)*?\1/g,
    comments: /#.*/g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  java: {
    keywords:
      /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
    strings: /(["'])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  cpp: {
    keywords:
      /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|namespace|bool|explicit|template|new|try|catch|throw|using|virtual|friend|inline|public|private|protected)\b/g,
    strings: /(["'])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
};

// Get the patterns for a specific language or default to JavaScript
const getPatterns = (language: string) => {
  return (
    highlightPatterns[language as keyof typeof highlightPatterns] ||
    highlightPatterns.javascript
  );
};

// This is a simple syntax highlighter component.
// For a production app, consider using a more robust library like Monaco Editor or CodeMirror
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = "Enter your code here...",
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle textarea input
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Highlight the code
  const highlightCode = (code: string) => {
    if (!code) return placeholder;

    const patterns = getPatterns(language);

    // Apply syntax highlighting in order:
    // 1. Escape HTML to prevent XSS
    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Apply highlighting patterns - but protect from overlapping replacements
    // Store the replacements and their positions
    const replacements: { start: number; end: number; html: string }[] = [];

    // Add replacements for comments
    let match;
    while ((match = patterns.comments.exec(highlighted)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        html: `<span class="text-gray-500">${match[0]}</span>`,
      });
    }

    // Add replacements for strings
    patterns.strings.lastIndex = 0; // Reset the regex
    while ((match = patterns.strings.exec(highlighted)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        html: `<span class="text-green-500">${match[0]}</span>`,
      });
    }

    // Add replacements for keywords
    patterns.keywords.lastIndex = 0;
    while ((match = patterns.keywords.exec(highlighted)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        html: `<span class="text-purple-500 font-medium">${match[0]}</span>`,
      });
    }

    // Add replacements for functions
    patterns.functions.lastIndex = 0;
    while ((match = patterns.functions.exec(highlighted)) !== null) {
      const functionName = match[0].substring(0, match[0].length - 1);
      replacements.push({
        start: match.index,
        end: match.index + functionName.length,
        html: `<span class="text-blue-500">${functionName}</span>`,
      });
    }

    // Add replacements for numbers
    patterns.numbers.lastIndex = 0;
    while ((match = patterns.numbers.exec(highlighted)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        html: `<span class="text-orange-500">${match[0]}</span>`,
      });
    }

    // Sort replacements by position (last to first)
    replacements.sort((a, b) => b.start - a.start);

    // Apply replacements
    for (const { start, end, html } of replacements) {
      highlighted =
        highlighted.substring(0, start) + html + highlighted.substring(end);
    }

    // Replace newlines with <br> for display
    highlighted = highlighted.replace(/\n/g, "<br>");

    return highlighted;
  };

  // Sync textarea size with pre
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  // Handle tab key to insert spaces instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Move cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={`relative font-mono text-sm ${className}`}>
      {/* Hidden pre element for syntax highlighting */}
      <pre
        className={`absolute top-0 left-0 right-0 bottom-0 p-2 overflow-hidden whitespace-pre-wrap break-words border ${isFocused ? "border-blue-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-slate-900 pointer-events-none`}
        style={{ color: "inherit" }}
        dangerouslySetInnerHTML={{ __html: highlightCode(value) }}
        aria-hidden="true"
      />

      {/* Actual textarea for editing */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full p-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-transparent caret-slate-900 dark:caret-white"
        style={{ minHeight: "200px" }}
        spellCheck="false"
        placeholder={placeholder}
      />
    </div>
  );
};

export default CodeEditor;
