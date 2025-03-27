import axios from 'axios';

// Define types
export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface SubmissionResponse {
  token: string;
}

export interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string;
  memory: number;
  status: {
    id: number;
    description: string;
  };
}

// Map frontend language values to Judge0 language IDs
// Full list available at https://api.judge0.com/languages/
export const languageIdMap: Record<string, number> = {
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  python: 71,      // Python (3.8.1)
  java: 62,        // Java (OpenJDK 13.0.1)
  cpp: 54,         // C++ (GCC 9.2.0)
};

// Judge0 status codes
export const statusMap: Record<number, string> = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

// Create a Judge0 client with default configuration
export const createJudge0Client = (baseURL: string = 'https://judge0-ce.p.rapidapi.com') => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
    },
  });
  
  // Helper function to encode string to base64
  const encode = (str: string | null): string | null => {
    if (!str) return null;
    try {
      return Buffer.from(str, "binary").toString("base64");
    } catch (e) {
      console.error('Failed to encode string to base64:', e);
      return str;
    }
  };
  
  // Helper function to decode base64 responses
  const decode = (str: string | null): string | null => {
    if (!str) return null;
    try {
      return Buffer.from(str, 'base64').toString();
    } catch (e) {
      console.error('Failed to decode base64 string:', e);
      return str;
    }
  };

  return {
    /**
     * Submit code for execution
     */
    submitSubmission: async (submission: SubmissionRequest): Promise<SubmissionResponse> => {
      const response = await apiClient.post('/submissions', submission);
      return response.data;
    },

    /**
     * Get submission details by token
     */
    getSubmission: async (token: string, useBase64: boolean = false): Promise<SubmissionResult> => {
      const response = await apiClient.get(`/submissions/${token}?base64_encoded=${useBase64}&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`);
      const data = response.data;
      
      // Decode base64 fields if necessary
      if (useBase64) {
        return {
          ...data,
          stdout: decode(data.stdout),
          stderr: decode(data.stderr),
          compile_output: decode(data.compile_output),
          message: decode(data.message)
        };
      }
      
      return data;
    },

    /**
     * Wait for submission to complete and return the result
     * This will poll the API until the submission is complete or timeout is reached
     */
    waitForResult: async (token: string, useBase64: boolean = false, pollInterval = 1000, maxAttempts = 30): Promise<SubmissionResult> => {
      let attempts = 0;

      const poll = async (): Promise<SubmissionResult> => {
        attempts++;
        const result = await apiClient.get(`/submissions/${token}?base64_encoded=${useBase64}&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`);
        const data = result.data;
        
        // If the submission is still being processed, wait and try again
        if (data.status.id <= 2 && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return poll();
        }
        
        // Decode base64 fields if necessary
        if (useBase64) {
          return {
            ...data,
            stdout: decode(data.stdout),
            stderr: decode(data.stderr),
            compile_output: decode(data.compile_output),
            message: decode(data.message)
          };
        }
        
        return data;
      };

      return poll();
    },

    /**
     * Execute code and return the result
     * This is a convenience method that combines submitSubmission and waitForResult
     */
    executeCode: async (
      sourceCode: string,
      languageValue: string,
      stdin?: string,
      useBase64: boolean = false
    ): Promise<SubmissionResult> => {
      const languageId = languageIdMap[languageValue];
      
      if (!languageId) {
        throw new Error(`Unsupported language: ${languageValue}`);
      }

      // Encode code and input if using base64
      const encodedSourceCode = useBase64 ? encode(sourceCode) : sourceCode;
      const encodedStdin = stdin && useBase64 ? encode(stdin) : stdin;

      const submission: SubmissionRequest = {
        source_code: encodedSourceCode as string,
        language_id: languageId,
      };

      if (encodedStdin) {
        submission.stdin = encodedStdin;
      }

      try {
        // Submit the code
        const { token } = await apiClient.post('/submissions', submission, {
          params: { base64_encoded: useBase64 }
        }).then(res => res.data);
        
        // Wait a second to give Judge0 time to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the result
        const result = await apiClient.get(`/submissions/${token}?base64_encoded=${useBase64}&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`);
        const data = result.data;
        
        // Decode base64 fields if necessary
        if (useBase64) {
          return {
            ...data,
            stdout: decode(data.stdout),
            stderr: decode(data.stderr),
            compile_output: decode(data.compile_output),
            message: decode(data.message)
          };
        }
        
        return data;
      } catch (error) {
        console.error('Error executing code:', error);
        throw error;
      }
    }
  };
};

// Default export
export default createJudge0Client; 