# Overview

Moroux is an Arabic AI training platform built as a full-stack web application. The platform offers courses in AI skills, academic subjects, and specialty areas with features for student enrollment, course management, certificate generation, and administrative oversight. The application uses a modern React frontend with a Node.js/Express backend, providing both student-facing course catalog functionality and administrative management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with React 18 using Vite as the build tool and development server
- **UI Framework**: Utilizes shadcn/ui components with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Internationalization**: RTL (right-to-left) support for Arabic content

## Backend Architecture
- **Server Framework**: Express.js with TypeScript for type safety
- **Data Layer**: In-memory storage implementation with interface-based design for easy database migration
- **API Design**: RESTful endpoints for students, courses, certificates, and admin operations
- **Development Setup**: Hot reload with Vite integration in development mode
- **Build Process**: ESBuild for server bundling with ES modules support

## Database Design
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Tables**: Students, courses, certificates, and admins with proper relationships
- **Data Types**: Uses JSONB for flexible data storage (enrolled courses, certificates)
- **Migration Strategy**: Drizzle Kit for schema migrations and database management

## Authentication & Authorization
- **Student Authentication**: Simple phone-based login/registration system
- **Admin Authentication**: Password-based authentication with hardcoded credentials
- **Session Management**: LocalStorage for client-side state persistence
- **Access Control**: Role-based access with separate student and admin interfaces

## External Dependencies

- **Database**: Neon PostgreSQL serverless database with connection pooling
- **UI Components**: Radix UI primitives for accessible component foundation
- **Icons**: FontAwesome icons for consistent iconography
- **Fonts**: Google Fonts integration (Inter, Fira Code, DM Sans, Architects Daughter)
- **WhatsApp Integration**: Direct linking to WhatsApp groups for course enrollment and communication
- **Firebase**: Configured for potential future features (auth, storage, firestore)
- **Development Tools**: Replit-specific plugins for development environment integration