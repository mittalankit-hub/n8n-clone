# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n-inspired workflow automation platform built with Next.js 15, React 19, and modern TypeScript. It uses a visual flow-based editor for creating automation workflows with nodes and connections.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Lint with Biome
npm run lint

# Format code with Biome
npm run format
```

## Core Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with Turbopack
- **UI**: React 19, Radix UI, Tailwind CSS 4
- **State Management**: Jotai (atoms), tRPC + TanStack Query (server state)
- **Database**: PostgreSQL via Prisma ORM (schema in `prisma/schema.prisma`)
- **Authentication**: Better Auth with Polar.sh integration for subscriptions
- **Visual Editor**: @xyflow/react (React Flow)
- **Background Jobs**: Inngest
- **AI Integration**: Vercel AI SDK with Anthropic, OpenAI, and Google providers
- **Monitoring**: Sentry
- **Code Quality**: Biome (linting & formatting)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Main app layout
│   │   ├── (rest)/        # Standard dashboard pages
│   │   └── (editor)/      # Workflow editor pages
│   └── api/               # API routes (auth, trpc, inngest)
├── features/              # Feature-based modules
│   ├── auth/             # Authentication components
│   ├── editor/           # Workflow editor (Editor component, atoms)
│   ├── executions/       # Execution nodes (HTTP_REQUEST)
│   ├── triggers/         # Trigger nodes (MANUAL_TRIGGER)
│   ├── workflows/        # Workflow management (CRUD, hooks)
│   └── subscriptions/    # Premium subscription logic
├── components/           # Shared UI components
│   ├── ui/              # shadcn/ui components
│   └── react-flow/      # Flow editor base components
├── config/              # Configuration files
│   ├── constants.ts     # App constants (pagination, etc.)
│   └── node-components.ts  # Node type registry
├── lib/                 # Core utilities
│   ├── auth.ts          # Better Auth server config
│   ├── client-auth.ts   # Better Auth client
│   ├── prisma.ts        # Prisma client singleton
│   ├── polar.ts         # Polar.sh client
│   └── utils.ts         # General utilities
├── trpc/                # tRPC setup
│   ├── init.ts          # tRPC context, procedures
│   ├── routers/         # tRPC router definitions
│   ├── server.tsx       # Server-side tRPC
│   └── client.tsx       # Client-side tRPC
├── inngest/             # Background jobs
│   ├── client.ts        # Inngest client
│   └── functions.ts     # Job definitions (AI execution, workflow creation)
└── generated/           # Generated Prisma client
    └── prisma/
```

### Key Architectural Patterns

#### Feature Organization
Features are organized by domain in `src/features/`. Each feature contains:
- `components/` - React components specific to the feature
- `hooks/` - Custom hooks (using tRPC queries/mutations)
- `server/` - Server-side logic, tRPC routers (`route.ts`)
- `params.ts` / `params-loader.ts` - URL parameter handling (using nuqs)

#### Node System
Workflow nodes follow a strict type system defined in `prisma/schema.prisma`:
```prisma
enum NodeType {
  INITIAL
  MANUAL_TRIGGER
  HTTP_REQUEST
}
```

New node types must:
1. Add enum value to `NodeType` in Prisma schema
2. Create component in appropriate feature (triggers, executions, etc.)
3. Register in `src/config/node-components.ts`
4. Run `prisma generate` to update types

Example node registration:
```typescript
// src/config/node-components.ts
export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes
```

#### State Management Strategy
- **Global UI State**: Jotai atoms (e.g., `editorAtom` in `src/features/editor/store/atoms.ts`)
- **Server State**: tRPC + TanStack Query (auto-cached, invalidated on mutations)
- **URL State**: nuqs for searchParams (pagination, filters)
- **Form State**: react-hook-form with Zod validation

#### tRPC Procedures
Three procedure types in `src/trpc/init.ts`:
- `baseProcedure` - Public endpoints
- `protectedProcedure` - Requires authentication
- `premiumProcedure` - Requires active Polar.sh subscription

#### Database Schema Patterns
- All models use `cuid()` for IDs (except User, which uses Better Auth's ID)
- Cascading deletes configured: deleting a Workflow deletes all Nodes and Connections
- `position` and `data` fields on Node use JSON type for flexibility
- Unique constraint on Connection prevents duplicate edges

#### React Flow Integration
The workflow editor (`src/features/editor/components/editor.tsx`):
- Uses `@xyflow/react` for node-based UI
- State synced between React Flow and Prisma via tRPC mutations
- `onInit` callback stores ReactFlowInstance in Jotai atom for programmatic access
- Node types registered via `nodeComponents` config

#### Authentication Flow
- Better Auth handles auth with Polar.sh plugin for monetization
- Session management via PostgreSQL (see `Session` model)
- Email/password enabled with auto sign-in
- Premium features gated by checking `customer.activeSubscriptions` via Polar API

#### Background Jobs (Inngest)
Located in `src/inngest/functions.ts`:
- AI execution jobs for Gemini, Anthropic, OpenAI
- `createWorkflow` job for async workflow creation
- Jobs exposed via `/api/inngest` route

## Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name description_of_changes

# Apply migrations to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (DESTRUCTIVE)
npx prisma migrate reset
```

**Important**: Prisma client is generated to `src/generated/prisma` (not default location). Always import from `@/generated/prisma`.

## Environment Variables

Required environment variables (see `.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Better Auth encryption key
- `POLAR_ACCESS_TOKEN` - Polar.sh API token
- `POLAR_SUCCESS_URL` - Redirect URL after subscription
- AI provider keys (ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY)
- Inngest keys (INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY)
- Sentry DSN (optional)

## Adding New Features

### Adding a New Node Type

1. Update Prisma schema:
```prisma
enum NodeType {
  INITIAL
  MANUAL_TRIGGER
  HTTP_REQUEST
  YOUR_NEW_TYPE  // Add here
}
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Create node component in appropriate feature directory:
```typescript
// src/features/[category]/components/[your-node]/node.tsx
export const YourNewNode = () => {
  return <BaseNode>...</BaseNode>
}
```

4. Register in `src/config/node-components.ts`:
```typescript
export const nodeComponents = {
  // ...existing
  [NodeType.YOUR_NEW_TYPE]: YourNewNode,
}
```

### Adding a New tRPC Router

1. Create router file: `src/features/[feature]/server/route.ts`
2. Export router using `createTRPCRouter`
3. Add to `src/trpc/routers/_app.ts`:
```typescript
export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  yourFeature: yourFeatureRouter, // Add here
});
```

### Adding a New Inngest Job

Add function to `src/inngest/functions.ts`:
```typescript
export const yourJob = inngest.createFunction(
  { id: "your-job-id" },
  { event: "your/event" },
  async ({ event, step }) => {
    // Job logic
  }
);
```

## Code Style Conventions

- Use Biome for all formatting and linting (configured in `biome.json` if present)
- Prefer named exports over default exports (except for Next.js pages/layouts)
- Use `@/` path alias for imports from `src/`
- Component files use PascalCase (e.g., `Editor.tsx`)
- Utility files use kebab-case (e.g., `use-workflows.ts`)
- tRPC routes in `route.ts` files, not `router.ts`
- Server-only code must import `"server-only"` at top
- Client components must have `"use client"` directive

## Important Notes

- The project uses Tailwind CSS 4 (PostCSS version), not the traditional config file
- React Flow nodes must be registered in `nodeComponents` config to render
- Premium features use Polar.sh subscriptions - check `premiumProcedure` usage
- Sentry is configured for both client and server monitoring
- Prisma client output is in `src/generated/prisma`, not the default location
- Always use transactions when updating workflow nodes + connections together
