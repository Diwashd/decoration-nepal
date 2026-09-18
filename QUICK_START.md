# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js 20+ installed
- PostgreSQL 14+ installed
- Git Bash or similar terminal

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd D:/omniroute
npm install
```

### 2. Setup PostgreSQL Database
```bash
# Create database (if not exists)
createdb omniroute_dev

# Or using psql:
psql -U postgres
CREATE DATABASE omniroute_dev;
\q
```

### 3. Push Database Schema
```bash
npm run db:push
```

### 4. Seed Initial Data
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

## 🎯 Access Points

### Customer Website
- URL: http://localhost:3000
- Features: Homepage, Service pages, SEO routes

### Admin Panel
- URL: http://localhost:3000/admin/login
- Email: admin@decorationnepal.com
- Password: admin123

### Database Studio
```bash
npm run db:studio
```
- URL: http://localhost:4983

## 🔍 Verify Installation

### Check Database
```bash
npm run db:studio
```
Should show 29 tables with seed data.

### Check Customer Site
Visit http://localhost:3000 - should show homepage with 11:11 branding.

### Check Admin Login
Visit http://localhost:3000/admin - should redirect to login page.

## ⚠️ Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env.local`
- Ensure database exists: `psql -l`

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### TypeScript Errors
```bash
npm run build
```
Will show any type errors to fix.

## 📝 Next Steps

1. **Test Admin Login** - Login and explore dashboard
2. **Review Database** - Open Drizzle Studio
3. **Build Event Planner** - Create `app/planner/page.tsx`
4. **Build Admin Modules** - Leads, Quotations, Events

## 🎓 Documentation

- Full README: `README.md`
- Build Status: `BUILD_STATUS.md`
- Completion Summary: `COMPLETION_SUMMARY.md`

---

**Need Help?** Check the documentation files or review the database schema in `lib/db/schema.ts`
