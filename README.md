# AI Learning Frontend

A clean, structured React application for AI-assisted learning assessments.

## 🏗️ Project Structure

```
src/
├── api/                    # API layer
│   ├── auth.js            # Authentication functions
│   ├── base.js            # Base API configuration
│   └── utility.js         # Assessment and data utilities
├── components/            # React components
│   ├── Assessment/        # Assessment component
│   ├── BlackboardLoading/ # Blackboard LMS loading
│   ├── DirectLinkLoading/ # Direct link loading
│   ├── ErrorBoundary/    # Error handling
│   ├── ErrorPage/        # Error display
│   ├── Evaluation/       # Evaluation results
│   ├── Header/           # App header
│   ├── Loader/           # Loading states
│   ├── SSOLoading/       # SSO authentication
│   └── UI/               # Reusable UI components
├── constants/             # Configuration constants
│   └── routes.js         # Routes and app config
├── contexts/             # React contexts
│   └── AppContext.js     # Global app state
├── styles/               # Global styles
│   └── globals.css      # Application styles
├── utils/               # Utility functions
│   └── timeTracker.js  # Time tracking utilities
├── App.jsx              # Main application component
└── main.jsx            # Application entry point
```

## 🚀 Features

### Authentication Flow
- **SSO Login** (`/sso`) - Backend-driven redirect
- **Direct Link** (`/direct`) - Score-based routing
- **Blackboard LMS** (`/lms`) - Direct to evaluation

### Core Functionality
- Assessment generation and submission
- Performance evaluation and scoring
- Real-time progress tracking
- Error handling and recovery

## 🛠️ Technical Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

## 📝 Environment Variables

```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_MOCK=false
```

## 🚦 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🔧 Configuration

The application uses three main entry points:

- `/sso` - Single Sign-On authentication
- `/direct` - Direct link access with student/course GUIDs
- `/lms` - Blackboard LMS integration

Each route automatically determines whether to show the assessment or evaluation page based on user data.

## 📊 API Integration

The app integrates with backend APIs for:
- Authentication and token management
- Assessment data generation
- Score evaluation and tracking
- Course configuration

## 🎯 Design Principles

- **Clean Architecture** - Separation of concerns
- **Minimal Dependencies** - Only essential packages
- **Error Resilience** - Comprehensive error handling
- **Performance Optimized** - Efficient data fetching and caching
