# Deploy 11:11 Decoration Nepal to Vercel

This project is a Next.js application with a PostgreSQL database managed through Drizzle ORM.

## 1. Prepare the database

Create a hosted PostgreSQL database with Supabase, Neon, or another PostgreSQL provider. Copy its connection string and keep it private.

The application reads the database connection from:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

For Supabase, use the connection string recommended for server-side applications. If the provider offers both pooled and direct connections, use the provider's pooled connection for the deployed application and the direct connection for migrations when required.

## 2. Push the schema

From the project root, set `DATABASE_URL` in your local `.env.local` to the hosted database connection string, then run:

```bash
npm install
npm run db:push
npm run db:seed
```

Run the seed command only when the database is new or when you intentionally want to load the sample records.

## 3. Import the project into Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Open [Vercel](https://vercel.com/new) and select **Add New Project**.
3. Import the repository.
4. Keep the detected framework as **Next.js**.
5. Use the repository root as the project root.
6. Keep the default build command: `next build`.
7. Deploy after adding the environment variables below.

## 4. Add Vercel environment variables

In **Project Settings > Environment Variables**, add these variables for **Production**, **Preview**, and **Development** as appropriate:

```env
DATABASE_URL=your-hosted-postgresql-connection-string
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=11:11 Decoration Nepal
SESSION_SECRET=generate-a-long-random-secret
JWT_SECRET=generate-a-long-random-secret
```

Optional SEO and analytics variables:

```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-search-console-token
NEXT_PUBLIC_GA_ID=G-your-google-analytics-id
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id
```

Do not commit `.env.local`, database passwords, or production secrets to the repository. Generate separate secrets for production rather than reusing the development values.

## 5. Deploy

Deploy from the Vercel dashboard, or connect the repository and use:

```bash
npm install -g vercel
vercel
vercel --prod
```

Every push to the production branch can then create a new production deployment. Pull requests and other branches can use Vercel preview deployments.

## 6. Verify the deployment

After deployment, check:

- The homepage loads at the Vercel URL.
- Event pages and `/planner` load without server errors.
- `/admin/login` loads and authentication works.
- A planner submission can read and write database data.
- Static assets and uploaded images resolve correctly.
- The Vercel deployment logs contain no database connection errors.

The default seeded admin account is:

```text
Email: admin@decorationnepal.com
Password: admin123
```

Change or remove this account before sharing the production application.

## Troubleshooting

### `DATABASE_URL` is missing

Add `DATABASE_URL` in Vercel for the environment being deployed, then redeploy. Environment variable changes apply to new deployments.

### Database connection errors

Confirm that the connection string is valid, the database accepts external connections, and the provider's SSL requirements are satisfied. This project enables SSL automatically for Supabase and Neon URLs.

### The build fails after a dependency or Next.js update

Run the same build locally:

```bash
npm run build
```

Fix the reported TypeScript, lint, or route error before redeploying. Vercel uses the repository's `package-lock.json`, so commit lockfile changes with dependency updates.

### The site still shows an old environment value

Confirm the variable is set for the correct Vercel environment and trigger a fresh deployment. `NEXT_PUBLIC_*` values are embedded during the build and are not changed at runtime.
