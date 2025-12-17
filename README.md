# WorkfitAI - Job Portal Platform

Modern dual-interface job portal built with Next.js 15, featuring a candidate portal and admin dashboard with role-based authentication.

**Version:** 0.1.0
**Framework:** Next.js 15.3.3 (App Router)
**Language:** TypeScript 5.x
**License:** Private

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm package manager
- Backend API Gateway running at `http://localhost:9085`

### Installation

```bash
# Clone repository
git clone <repository-url>
cd workfitai-ui

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit NEXT_PUBLIC_AUTH_BASE_URL if needed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Optional: SCSS Development

```bash
# Watch and compile SCSS changes
npm run sass
```

---

## Project Overview

WorkfitAI connects job seekers with employers through two distinct interfaces:

### Candidate Portal (`/`)
- Job search and browsing (grid/list views)
- Advanced filtering (industry, location, salary, experience)
- Job details and application
- Authentication (register, sign-in, OTP verification)
- Role-based registration (Candidate, HR, HR Manager)

### Admin Dashboard (`/admin`)
- Metrics dashboard with vacancy analytics
- Job management (create, edit, delete)
- Candidate tracking and application review
- Recruiter management
- Search analytics and insights

---

## Technology Stack

### Core
- **Next.js 15.3.3** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.x** - Type safety
- **Redux Toolkit 2.10.1** - State management
- **React Redux 9.2.0** - Redux bindings

### UI/Styling
- **SCSS/Sass 1.56.1** - CSS preprocessing
- **Bootstrap 5.x** - CSS framework
- **Swiper 11.0.7** - Carousels
- **Chart.js 4.2.1** - Data visualization
- **@headlessui/react 1.7.13** - Accessible components

### Utilities
- **nanoid 5.1.6** - Unique ID generation
- **WOW.js** - Scroll animations
- **React Perfect Scrollbar** - Custom scrollbars

---

## Architecture Highlights

### Route Organization
```
app/
├── (candidate)/          # Public portal routes
│   ├── page.tsx         # Homepage with job search
│   ├── jobs-list/       # Job listing (list view)
│   ├── jobs-grid/       # Job listing (grid view)
│   ├── job-details/     # Job detail page
│   ├── register/        # Registration
│   ├── verify-otp/      # OTP verification
│   └── layout.tsx       # Candidate layout
│
├── (control)/           # Admin dashboard routes
│   ├── admin/           # Dashboard
│   └── layout.tsx       # Admin layout
│
├── layout.tsx           # Root layout with Redux provider
└── providers.tsx        # Redux store + auth hydration
```

### State Management
- **Redux Toolkit** for global state
- **Auth state** persisted in localStorage
- **Session hydration** on page load
- **Typed hooks**: `useAppDispatch()`, `useAppSelector()`

### Authentication Flow
- **Access tokens**: JWT in Redux + localStorage
- **Refresh tokens**: HttpOnly cookies (server-managed)
- **Device tracking**: Unique device ID for session security
- **OTP verification**: Email-based verification for new users
- **Role-based registration**: Different flows for Candidate/HR/HR Manager

### API Integration
- **Base URL**: `http://localhost:9085`
- **Auth endpoints**: `/auth` (login, register, refresh, logout)
- **Job endpoints**: `/public/jobs`, `/hr/jobs`
- **Custom errors**: `UnauthorizedError`, `ForbiddenError`, `ApiError`

---

## Key Features

### Job Search & Discovery
- Advanced filter sidebar (industry, location, salary, experience, posted date)
- Grid and list view modes
- Real-time filtering with Redux state management
- Debounced keyword search
- Pagination controls

### Authentication System
- Multi-role registration (Candidate, HR, HR Manager, Admin)
- OTP email verification
- Role-based approval workflows
- Device ID tracking for security
- Automatic token refresh
- Session persistence across page reloads

### Admin Dashboard
- Real-time metrics (interviews, applications, bids)
- Vacancy trend visualization (Chart.js)
- Latest jobs panel
- Top candidates showcase
- Recruiter performance tracking
- Search analytics

---

## Development Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# SCSS compilation (watch mode)
npm run sass
```

---

## Project Structure

```
workfitai-ui/
├── app/                  # Next.js App Router
│   ├── (candidate)/      # Public portal
│   ├── (control)/        # Admin dashboard
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # Redux provider
│
├── components/           # React components
│   ├── auth/            # Auth-specific components
│   ├── elements/        # Reusable UI elements
│   ├── job/             # Job-related components
│   ├── sliders/         # Swiper carousels
│   ├── filter/          # Filter components
│   └── Layout/          # Layout components
│
├── redux/               # Redux Toolkit
│   ├── store.ts         # Store configuration
│   ├── hooks.ts         # Typed hooks
│   └── features/        # Feature slices
│       ├── auth/        # Auth state management
│       └── job/         # Job state management
│
├── lib/                 # Utility libraries
│   ├── authApi.ts       # Auth API client
│   ├── jobApi.ts        # Job API client
│   ├── deviceId.ts      # Device ID generation
│   └── validation.ts    # Form validation
│
├── types/               # TypeScript types
│   └── index.ts         # Domain models
│
├── hooks/               # Custom React hooks
│   └── useDebounce.ts   # Debounce hook
│
├── public/              # Static assets
│   └── assets/
│       ├── css/         # Compiled CSS (candidate)
│       ├── scss/        # SCSS source (candidate)
│       ├── imgs/        # Images (candidate)
│       └── control/     # Admin dashboard assets
│
├── docs/                # Documentation
│   ├── project-overview-pdr.md
│   ├── code-standards.md
│   ├── system-architecture.md
│   ├── codebase-summary.md
│   ├── project-roadmap.md
│   └── frontend/        # Backend integration docs
│
├── middleware.ts        # Next.js middleware (route protection)
├── next.config.js       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

---

## Environment Variables

Create `.env.local`:

```env
# Backend API Gateway URL
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:9085/auth
```

---

## Asset Organization

### Candidate Portal Assets
- **CSS**: `/assets/css/style.css` (compiled from SCSS)
- **Images**: `/assets/imgs/page/[section]/`
- **Fonts**: `/assets/fonts/uicons/`

### Admin Dashboard Assets
- **CSS**: `/assets/control/css/style.css`
- **Images**: `/assets/control/imgs/[section]/`
- **Fonts**: `/assets/control/fonts/`

**Rule**: Always use assets from respective directories. Never mix candidate and control assets.

---

## Code Standards

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`authenticateUser`)
- **Constants**: UPPER_SNAKE_CASE (`AUTH_STORAGE_KEY`)
- **Files**: camelCase for utils, PascalCase for components
- **SCSS**: kebab-case (`_variables.scss`)

### TypeScript Rules
- **Never use `any`** - prefer `unknown` if type is truly unknown
- All functions need explicit return types
- Interface for all API responses
- Use async/await, never `.then().catch()`

### Component Patterns
- Export default at bottom
- Props interface above component
- Use "use client" directive only when needed (Redux, hooks, events)
- Server components by default

---

## Documentation

Comprehensive documentation in `/docs`:

- **[Project Overview & PDR](docs/project-overview-pdr.md)** - Product requirements and features
- **[Code Standards](docs/code-standards.md)** - Coding conventions and patterns
- **[System Architecture](docs/system-architecture.md)** - Architecture patterns and flows
- **[Codebase Summary](docs/codebase-summary.md)** - File structure and module details
- **[Project Roadmap](docs/project-roadmap.md)** - Development phases and milestones
- **[Frontend Integration](docs/frontend/)** - Backend API integration guides

---

## Backend Integration

### Required Backend Services

WorkfitAI frontend requires a backend API gateway running at `http://localhost:9085` with the following services:

1. **Auth Service** (`/auth`)
   - User registration with OTP
   - Login/logout
   - Token refresh
   - Role-based access control

2. **Job Service** (`/public/jobs`, `/hr/jobs`)
   - Public job listings
   - Job CRUD operations (HR only)
   - Job filtering and search

3. **Application Service** (future)
   - Application submission
   - Application tracking

See `docs/frontend/` for complete API documentation.

---

## Development Workflows

### SCSS Compilation

SCSS files must be compiled before changes appear:

```bash
# Watch mode (keep running during development)
npm run sass

# Source: public/assets/scss/style.scss
# Output: public/assets/css/style.css
```

### Adding New Features

1. Review template pages in `app/(candidate)/` or `app/(control)/` for patterns
2. Create Redux slice if needed in `redux/features/[feature]/`
3. Build components in `components/[category]/`
4. Add routes in appropriate route group
5. Update SCSS in `public/assets/scss/` and compile

### Route Protection

Use middleware.ts for automatic route protection:
- `/admin/*` → requires auth + admin/hr role
- Public routes → no protection
- Auth pages → redirect if already authenticated

---

## Known Issues & Limitations

1. **Auth Hydration**: localStorage not available during SSR - handled with `useIsomorphicLayoutEffect`
2. **Source Maps**: Disabled in dev/prod for performance and security
3. **Node 25 Compatibility**: localStorage stub removed in `next.config.js`
4. **SCSS Watch**: Must run `npm run sass` separately during development

---

## Current Development Status

### Completed
- ✅ Authentication system with JWT + refresh tokens
- ✅ Role-based registration (Candidate, HR, HR Manager)
- ✅ OTP verification flow
- ✅ Job listing with advanced filters
- ✅ Grid and list view modes
- ✅ Admin dashboard with metrics
- ✅ Route protection middleware

### In Progress
- 🔄 Job application submission
- 🔄 Candidate profile management
- 🔄 HR job posting interface

### Planned
- 📋 Resume upload and parsing
- 📋 Email notifications
- 📋 Real-time messaging
- 📋 Advanced analytics
- 📋 Mobile app

See [Project Roadmap](docs/project-roadmap.md) for detailed phases.

---

## Contributing

### Workflow
1. Create feature branch from `dev`
2. Follow code standards in `docs/code-standards.md`
3. Test thoroughly (auth flows, role-based access)
4. Submit PR to `dev` branch
5. Ensure CI checks pass

### Commit Message Format
```
type(scope): description

feat(auth): add OTP verification flow
fix(jobs): resolve filter state persistence issue
docs(readme): update installation instructions
refactor(api): extract error handling to utility
```

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Chart.js**: https://www.chartjs.org
- **Swiper**: https://swiperjs.com
- **Bootstrap**: https://getbootstrap.com

---

## License

Private - All rights reserved

---

## Support

For issues, questions, or feature requests, contact the development team.

**Last Updated**: 2025-12-11
**Maintained by**: WorkfitAI Development Team
