# JobsForce Frontend

A modern, feature-rich job application platform built with Next.js 15 and React 19. JobsForce provides a seamless job searching, application management, and technical interviewing experience.

![JobsForce Platform](https://placeholder-for-jobsforce-screenshot.com)

## 🚀 Features

### 💼 Job Board
- **Advanced Job Search**: Filter jobs by skills, location, and experience level
- **Personalized Job Recommendations**: Smart job matching based on your profile
- **Application Tracking**: Monitor your application status in real-time

### 👩‍💻 Interactive Technical Interviews
- **Coding Challenges**: LeetCode-style problems with real-time execution
- **Multi-language Support**: JavaScript, Python, Java, and C++
- **Automated Test Validation**: Instant feedback on code solutions
- **Code Review**: Practice code review scenarios for real-world preparation

### 👤 User Management
- **Secure Authentication**: Powered by Clerk for seamless and secure user management
- **Profile Management**: Comprehensive profile building with resume upload
- **Dashboard**: Track applications, interviews, and job statuses

### 📱 Progressive Web App
- **Responsive Design**: Works seamlessly across devices
- **Offline Support**: Core functionality available without internet
- **Installable**: Add to home screen on mobile devices

## 📂 Project Structure

```
jobsforce-frontend/
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions workflows
│       └── ci.yml            # CI pipeline configuration
├── .next/                    # Next.js build output (generated)
├── public/                   # Static assets
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── interview/        # Interview platform
│   │   │   ├── code-review/  # Code review challenges
│   │   │   ├── question/     # Coding questions
│   │   │   └── [id]/         # Dynamic interview routes
│   │   ├── jobboard/         # Job board pages
│   │   ├── profile/          # User profile pages
│   │   ├── sign-in/          # Authentication pages
│   │   ├── sign-up/          # Registration pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── manifest.json     # PWA manifest
│   │   ├── not-found.tsx     # 404 page
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── JobBoard/         # Job board specific components
│   │   ├── hero-header.tsx   # Landing page hero header
│   │   ├── hero-section.tsx  # Hero section component
│   │   ├── logo.tsx          # Logo component
│   │   └── MainWrapper.tsx   # Main layout wrapper
│   ├── lib/                  # Utilities and helpers
│   └── middleware.ts         # Next.js middleware (auth)
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore configuration
├── biome.json                # Biome configuration
├── components.json           # UI component configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies
├── package-lock.json         # Dependency lock file
├── postcss.config.mjs        # PostCSS configuration
├── README.md                 # Project documentation
├── README-INTERVIEW.md       # Interview platform documentation
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🏗️ Architecture & Scalability

### 🧩 Modular Design
- **Component-Based Architecture**: Reusable UI components for consistency
- **Feature-Based Organization**: Code structured by business domains
- **Clean Code Practices**: Follows best practices for maintainability

### 🔄 State Management
- **Zustand**: Lightweight state management with minimal boilerplate
- **React Server Components**: Optimized rendering and data loading
- **Server Actions**: Efficient data mutations without custom API routes

### 🚄 Performance
- **Next.js App Router**: Leveraging the latest Next.js framework features
- **React 19**: Taking advantage of the newest React optimizations
- **Turbopack**: Faster development experience with improved build times
- **Progressive Enhancement**: Core functionality works regardless of JavaScript availability

### 🌐 API Integration
- **Backend Integration**: Seamless connection with JobsForce backend services
- **Judge0 API**: Real-time code execution for technical interviews
- **Clerk Authentication**: Secure user management

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15**: Server-side rendering, static site generation, and API routes
- **React 19**: Latest React features for building interactive UIs
- **TypeScript**: Type safety and improved developer experience
- **TailwindCSS 4**: Utility-first CSS framework for responsive design

### Key Packages
- **@clerk/nextjs**: Authentication and user management
- **@ducanh2912/next-pwa**: Progressive Web App capabilities
- **@monaco-editor/react**: VS Code-like editor for coding interviews
- **axios**: HTTP client for API requests
- **framer-motion**: Animation library for smooth UI transitions
- **zustand**: State management solution
- **date-fns**: Date utility library
- **react-hot-toast**: Elegant notifications system

### Development Tools
- **Biome**: Modern JavaScript linter and formatter
- **ESLint**: Code quality tool
- **TypeScript**: Type checking
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- RapidAPI key for Judge0 API (for code execution)
- Clerk account for authentication services

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/jobsforce-frontend.git
   cd jobsforce-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
     CLERK_SECRET_KEY=your_clerk_secret
     NEXT_PUBLIC_BACKEND_URL=backend_url
     NEXT_PUBLIC_FRONTEND_URL=frontend_url
     NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
     ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome checks with auto-fix
- `npm run preview` - Build and preview production build locally

## 🧪 Testing and Quality Assurance

- **GitHub Actions**: Automated testing on pull requests and merges
- **Continuous Integration**: Format, lint, and build verification
- **Type Safety**: Comprehensive TypeScript types throughout the codebase

## 📚 Documentation

Additional documentation:
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Interview Platform Guide](./README-INTERVIEW.md)

## 🌐 Deployment

The application is automatically deployed using Vercel's GitHub integration.

## 📄 License

MIT
