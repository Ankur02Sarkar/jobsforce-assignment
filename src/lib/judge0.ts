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
    getSubmission: async (token: string): Promise<SubmissionResult> => {
      const response = await apiClient.get(`/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`);
      return response.data;
    },

    /**
     * Wait for submission to complete and return the result
     * This will poll the API until the submission is complete or timeout is reached
     */
    waitForResult: async (token: string, pollInterval = 1000, maxAttempts = 30): Promise<SubmissionResult> => {
      let attempts = 0;

      const poll = async (): Promise<SubmissionResult> => {
        attempts++;
        const result = await apiClient.get(`/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`);
        
        // If the submission is still being processed, wait and try again
        if (result.data.status.id <= 2 && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return poll();
        }
        
        return result.data;
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
      expectedOutput?: string
    ): Promise<SubmissionResult> => {
      const languageId = languageIdMap[languageValue];
      
      if (!languageId) {
        throw new Error(`Unsupported language: ${languageValue}`);
      }

      const submission: SubmissionRequest = {
        source_code: sourceCode,
        language_id: languageId,
      };

      if (stdin) {
        submission.stdin = stdin;
      }

      if (expectedOutput) {
        submission.expected_output = expectedOutput;
      }

      const { token } = await apiClient.post('/submissions', submission).then(res => res.data);
      return await apiClient.get(`/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,status,compile_output,message,time,memory`).then(res => res.data);
    }
  };
};

// Default export
export default createJudge0Client; 