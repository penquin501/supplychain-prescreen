# Overview

This is a Supply Chain Finance (SCF) Pre-Screen Platform built as a full-stack web application for evaluating and scoring supplier creditworthiness. The platform provides comprehensive supplier onboarding, financial analysis, and credit scoring capabilities with an intuitive dashboard interface.

The system allows users to manage supplier profiles, analyze financial data over multiple years, track transaction histories, and generate automated credit scores and reports to support lending decisions in supply chain finance scenarios.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a Single Page Application (SPA) structure
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a component-based architecture with clear separation between pages, reusable components, and UI primitives. The app structure includes dedicated pages for dashboard, supplier profiles, and credit reports.

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful API endpoints following standard HTTP conventions
- **Development**: Hot module replacement and middleware logging for development experience

The backend implements a clean separation between routes, storage layer, and business logic. The storage interface allows for easy switching between in-memory and database implementations.

## Database Schema Design
The system uses a relational schema with the following core entities:
- **Suppliers**: Company information, registration details, and business profiles
- **Financial Data**: Multi-year financial statements including income and balance sheet data
- **Transactions**: Purchase orders and payment history with buyers
- **Documents**: Document submission tracking for compliance
- **Scores**: Calculated credit scores and recommendations

Each entity uses UUID primary keys and includes proper foreign key relationships for data integrity.

## Credit Scoring System
Implements a multi-factor scoring algorithm including:
- **Financial Score**: Based on profitability, liquidity ratios, and debt management
- **Transactional Score**: Proprietary RFM (Recency, Frequency, Monetary) model for transaction analysis - core business methodology
- **Document Score (A-Score)**: Compliance tracking based on required document submissions
- **Overall Recommendation**: Simple average calculation (Financial + Transactional + A-Score) ÷ 3

## Scoring Color System
- 0%-30% = Not Pass (Red)
- 31%-80% = Pending (Yellow) 
- 80%-100% = Pass (Green)

## Development Workflow
- **Type Safety**: Full TypeScript coverage across client, server, and shared schema
- **Schema Validation**: Zod schemas for runtime validation and type generation
- **Development Server**: Integrated Vite dev server with Express API proxy
- **Build Process**: Separate client and server builds with ESBuild for server bundling

## External Dependencies

- **Database**: PostgreSQL with Neon serverless driver
- **UI Framework**: Radix UI primitives for accessible components
- **Validation**: Zod for schema validation and TypeScript integration
- **Development Tools**: Vite, ESBuild, and TypeScript for development workflow
- **Session Management**: PostgreSQL session store for user sessions
- **Deployment**: Configured for Replit environment with development banners and cartographer integration