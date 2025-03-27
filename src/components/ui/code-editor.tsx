"use client";

import React, { useState, useEffect, useRef } from 'react';

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
    keywords: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|from|try|catch|finally|throw|async|await)\b/g,
    strings: /(["'`])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  python: {
    keywords: /\b(def|if|else|elif|for|while|return|import|from|as|class|try|except|finally|with|in|not|and|or|is|None|True|False|pass|break|continue|raise|assert|global|nonlocal|lambda)\b/g,
    strings: /(["'`])(\\?.)*?\1/g,
    comments: /#.*/g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  java: {
    keywords: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
    strings: /(["'])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
  cpp: {
    keywords: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|namespace|bool|explicit|template|new|try|catch|throw|using|virtual|friend|inline|public|private|protected)\b/g,
    strings: /(["'])(\\?.)*?\1/g,
    comments: /\/\/.*|\/\*[\s\S]*?\*\//g,
    functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
};

// Get the patterns for a specific language or default to JavaScript
const getPatterns = (language: string) => {
  return highlightPatterns[language as keyof typeof highlightPatterns] || highlightPatterns.javascript;
};

// This is a simple syntax highlighter component. 
// For a production app, consider using a more robust library like Monaco Editor or CodeMirror
const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  language, 
  placeholder = 'Enter your code here...',
  className = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle textarea input
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Highlight the code
  const highlightCode = (code: string) => {
    if (!code) return '';
    
    const patterns = getPatterns(language);
    
    // Apply syntax highlighting in order:
    // 1. Escape HTML to prevent XSS
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // 2. Apply highlighting patterns
    highlighted = highlighted
      // Comments (first to avoid highlighting inside comments)
      .replace(patterns.comments, match => `<span class="text-gray-500">${match}</span>`)
      // Strings
      .replace(patterns.strings, match => `<span class="text-green-500">${match}</span>`)
      // Keywords
      .replace(patterns.keywords, match => `<span class="text-purple-500 font-medium">${match}</span>`)
      // Functions
      .replace(patterns.functions, match => {
        const functionName = match.substring(0, match.length - 1);
        return `<span class="text-blue-500">${functionName}</span>(`;
      })
      // Numbers
      .replace(patterns.numbers, match => `<span class="text-orange-500">${match}</span>`);
    
    // Replace newlines with <br> for display
    highlighted = highlighted.replace(/\n/g, '<br>');
    
    return highlighted;
  };

  // Sync textarea size with pre
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  // Handle tab key to insert spaces instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={`relative font-mono text-sm ${className}`}>
      {/* Hidden pre element for syntax highlighting */}
      <pre 
        className={`absolute top-0 left-0 right-0 bottom-0 p-2 overflow-hidden whitespace-pre-wrap break-words ${isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-slate-900 text-transparent`}
        dangerouslySetInnerHTML={{ __html: highlightCode(value) || placeholder }}
      />
      
      {/* Actual textarea for editing */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full p-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none z-10 relative"
        style={{ caretColor: 'black', minHeight: '200px' }}
        spellCheck="false"
        placeholder={placeholder}
      />
    </div>
  );
};

export default CodeEditor; 