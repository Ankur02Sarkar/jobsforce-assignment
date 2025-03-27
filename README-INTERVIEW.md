# Coding Interview Platform

A modern, LeetCode-inspired coding assessment platform for conducting technical interviews. This platform allows candidates to solve coding challenges with syntax highlighting, real-time code execution, and automated test case validation.

## Features

- **Interactive Coding Questions**: Browse through a collection of coding challenges
- **Code Editor**: Syntax highlighting with support for multiple languages (JavaScript, Python, Java, C++)
- **Real-time Code Execution**: Execute code and see the results instantly
- **Automated Test Validation**: Test cases are executed automatically against candidate solutions
- **Timed Assessments**: Track candidate performance with built-in timer
- **Judge0 Integration**: Real code execution and validation using the Judge0 API
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Built-in dark mode for comfortable coding in low-light environments

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- RapidAPI key for Judge0 API (for code execution)

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your RapidAPI key:
     ```
     NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
     ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/interview](http://localhost:3000/interview) to see the coding questions list.

## Judge0 Integration

This platform uses the Judge0 API for code execution. To integrate with Judge0:

1. Sign up for a RapidAPI account at [RapidAPI.com](https://rapidapi.com)
2. Subscribe to the [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Get your API key and add it to the `.env` file

### Judge0 Language IDs

The platform supports the following languages by default:

- JavaScript (Node.js): ID 63
- Python: ID 71
- Java: ID 62
- C++: ID 54

Additional languages can be added by updating the `languageIdMap` in `src/lib/judge0.ts`.

## Extending the Platform

### Adding New Questions

To add new coding questions, edit the `codingQuestions` array in `src/app/interview/question/[id]/page.tsx`. Each question should include:

- ID
- Title
- Difficulty
- Description
- Full description (including problem statement, constraints, and examples)
- Test cases with input and expected output
- Starting code for each supported language

### Customizing the UI

The UI is built with Tailwind CSS and can be customized by editing the corresponding components:

- Question cards: `src/app/interview/[id]/page.tsx`
- Coding interface: `src/app/interview/question/[id]/page.tsx`
- Code editor: `src/components/ui/code-editor.tsx`

### Advanced Code Editor

For a more robust code editor experience, consider replacing the simple code editor with:

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor)
- [CodeMirror](https://codemirror.net/)
- [Ace Editor](https://ace.c9.io/)

## Production Deployment

To build and deploy the application:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## License

MIT 