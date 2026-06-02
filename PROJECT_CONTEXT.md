# ConstructDZ Frontend

## Tech Stack
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Router DOM v7
- React Query
- Axios
- React Hook Form
- Zod
- Radix UI
- JWT Decode
- React OAuth Google

## Architecture
src/
├── pages
├── components
├── layouts
├── hooks
├── routes
├── services
├── types
└── utils

## API
Base URL:
http://localhost:5000

Endpoints:
- /users
- /profiles
- /equipment
- /projects

## Authentication
- Login via /users
- Register via /users
- Token stored in localStorage
- Google OAuth enabled

## UI Rules
- Responsive first
- Cairo font
- Sticky Navbar
- Navbar:
  - الرئيسية
  - دخول
  - تسجيل

## Important Rules
- No extra libraries
- No scope creep
- Production ready code
- Keep existing design system