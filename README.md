# PulseCheck

PulseCheck is a team activity and collaboration tracker that helps teams monitor their collaborative energy and identify early signs of burnout, overload, or disengagement. The application provides visualizations of team activity data.

## Features

- **Authentication System**: Secure signup/login via email with Supabase
- **Team Management**: Create or join teams with invite codes
- **Activity Dashboard**: Overview of team activity metrics and visualizations
- **Data Visualization**: Charts showing activity trends and member contributions
- **Real-time Collaboration**: Up-to-date team activity tracking

## Tech Stack

- **Frontend**: Next.js with App Router and React Server Components
- **UI Components**: shadcn/ui for consistent design
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth
- **Database**: Supabase Postgres
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Supabase account and project set up

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/pulse-check.git
cd pulse-check
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Set up Supabase

1. Create a new Supabase project at https://app.supabase.com
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy the contents of `lib/supabase-schema.sql` and run it in the SQL Editor

### Step 4: Set up environment variables

Create a `.env.local` file in the root of your project with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project dashboard under Settings > API.

### Step 5: Run the development server

```bash
pnpm dev
```

Visit http://localhost:3000 to see the application in action.

## Deployment

### Deploy to Production

1. Set up environment variables in your hosting platform
2. Build and deploy:

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fpulse-check)

## License

MIT 