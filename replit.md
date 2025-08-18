# Overview

This is a Supply Chain Finance (SCF) Pre-Screen Platform built as a full-stack web application for evaluating and scoring supplier creditworthiness. The platform provides comprehensive supplier onboarding, financial analysis, and credit scoring capabilities with an intuitive dashboard interface.

The system allows users to manage supplier profiles, analyze financial data over multiple years, track transaction histories, and generate automated credit scores and reports to support lending decisions in supply chain finance scenarios.

## Recent Changes (August 18, 2025)
- Updated primary supplier data to authentic Thai company: บริษัท ทรี โพรเกรส โปรดักส์ จำกัด (Tree Progress Products Co., Ltd.)
- Integrated authentic 5-year financial data (2020-2024) from official Balance Sheet and Income Statement CSV files
- Business profile updated to ceramics/kitchenware wholesale with 27.5 years of operation
- Financial scoring reflects actual performance: A- grade with strong stability indicators
- Machine learning system implemented for pricing decision capture and future recommendation improvements
- **COMPLETED**: Full Balance Sheet structure integration matching BS_ CSV file format with all detailed line items:
  - Complete Assets breakdown: Cash (18.3M THB), Accounts Receivable (3.9M THB), Inventories (1.8M THB)
  - Comprehensive Liabilities: Accounts Payable (3.7M THB), Other Current Liabilities (0.3M THB)
  - Full Shareholders' Equity: Paid-up Capital (1M THB), Retained Earnings (29.4M THB)
  - All authentic financial progression data (2020-2024) now displays complete Balance Sheet structure exactly as required

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
- **Financial Data**: Comprehensive 5-year financial statements with detailed Balance Sheet and Income Statement fields
  - Balance Sheet: Complete asset, liability, and equity breakdown with current/non-current classifications
  - Income Statement: Full revenue, expense, and profitability analysis with operating metrics
  - Additional Information: Shareholders' equity details including stock information and per-share metrics
- **Transactions**: Purchase orders and payment history with buyers using proprietary RFM analysis
- **Documents**: Document submission tracking for compliance (18 required documents)
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