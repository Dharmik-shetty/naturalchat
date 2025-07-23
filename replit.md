# AI Chatbot Girlfriend Website

## Overview

This is a modern full-stack web application that provides an AI-powered chatbot girlfriend experience. Users can interact with virtual girlfriend characters, each with unique personalities and traits. The application features a professional, visually stunning interface with smooth animations and an addictive user experience designed to keep users engaged.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Authentication (Google Sign-In)
- **AI Integration**: Google Gemini 2.5 Flash API for character responses
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth transitions and effects

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application using Wouter for routing
- **Component Library**: shadcn/ui components with Radix UI primitives
- **State Management**: TanStack Query for server state, React Context for auth
- **Styling**: Tailwind CSS with custom romantic color palette and glass morphism effects
- **Animations**: Framer Motion for page transitions, scroll animations, and interactive elements

### Backend Architecture
- **Express Server**: RESTful API with TypeScript
- **Storage Layer**: Abstracted storage interface with in-memory implementation (ready for PostgreSQL)
- **AI Service**: Integration with Google Gemini API for generating character responses
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Database Schema
- **Users**: Firebase UID, email, display name, photo URL
- **Characters**: Name, description, personality, traits, interests, image URL
- **Conversations**: User-character chat sessions with metadata
- **Messages**: Individual chat messages with timestamps and user/AI flags
- **User Characters**: Relationship tracking between users and characters

## Data Flow

1. **Authentication Flow**: Firebase handles user authentication, syncs with backend
2. **Character Selection**: Users browse characters, filtered by traits/interests
3. **Chat Initialization**: Creates conversation record, loads character context
4. **Message Processing**: User input → AI service → character response → database storage
5. **Real-time Updates**: React Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for production
- **Firebase**: Authentication and user management
- **Google Gemini API**: AI-powered character responses
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Server state management
- **Framer Motion**: Animation library

### UI/UX Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form handling with validation

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot module replacement for rapid development
- **Express Server**: Runs on development mode with request logging
- **Environment Variables**: Firebase config, Gemini API key, database URL

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes
- **Static Assets**: Served by Express in production mode

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **Firebase Config**: API key, project ID, app ID
- **GEMINI_API_KEY**: Google AI API access
- **NODE_ENV**: Development/production mode switching

The application is designed to be deployed on platforms like Replit, Vercel, or Railway with PostgreSQL database support. The modular architecture allows for easy scaling and feature additions.