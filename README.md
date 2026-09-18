# 11:11 Decoration Nepal - Event Planning & Management Platform

A production-ready full-stack event planner and decoration management system for **11:11 Decoration Nepal**, built with Next.js 15, TypeScript, PostgreSQL, and Drizzle ORM.

## 🎯 Project Overview

Transform 11:11 Decoration Nepal from an inquiry-based business into a structured digital event-management platform with:

- **Customer Event Planner**: Multi-step wizard for event planning and instant quotations
- **Admin Operations Panel**: Complete CRM, inventory, quotations, payments, and operations management
- **Real-time Inventory**: Smart reservation system preventing double-booking
- **Dynamic Pricing Engine**: Automatic quotation calculation based on selections
- **Role-Based Access Control**: Granular permissions for different staff roles

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions & Route Handlers
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Secure session-based auth with bcrypt
- **UI Components**: Lucide Icons, shadcn/ui patterns
- **Forms**: React Hook Form + Zod validation

### Database Schema

29 comprehensive tables covering:
- Users & Authentication (RBAC)
- Customers & CRM (Leads, Follow-ups)
- Product Catalog (Event Types, Packages, Services, Add-ons, Themes, Color Palettes)
- Inventory Management (Items, Categories, Reservations)
- Quotations & Versioning
- Events & Operations (Checklists, Staff Assignments)
- Vendor Management
- Finance (Payments, Expenses, Profitability)
- Reviews & Moodboards
- Audit Logs & Notifications
- System Settings

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### Default Admin Credentials

After seeding:
- **Email**: admin@decorationnepal.com
- **Password**: admin123

⚠️ **Change these credentials in production!**

### Development

```bash
# Start development server
npm run dev

# Open Drizzle Studio (database GUI)
npm run db:studio
```

Visit:
- Customer Site: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Database Studio: http://localhost:4983

## 📁 Project Structure

```
omniroute/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Customer homepage
│   ├── [slug]/            # Dynamic event type pages (SEO-friendly)
│   ├── planner/           # Event planner wizard (TODO)
│   ├── admin/             # Admin panel (TODO)
│   └── layout.tsx         # Root layout
├── components/
│   └── customer/          # Customer-facing components
│       ├── CustomerLayout.tsx
│       ├── CustomerNav.tsx
│       └── CustomerFooter.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts      # Drizzle schema (29 tables)
│   │   ├── index.ts       # Database connection
│   │   └── seed.ts        # Seed data script
│   ├── services/
│   │   ├── auth.ts        # Authentication logic
│   │   └── session.ts     # Session management
│   ├── types/             # TypeScript types
│   └── utils.ts           # Utility functions
├── middleware.ts          # Auth middleware
├── drizzle.config.ts      # Drizzle configuration
└── .env.local             # Environment variables
```

## ✅ Completed Features

### Phase 1 - Foundation ✓
- [x] Next.js project setup with TypeScript
- [x] Database schema design (29 tables)
- [x] Drizzle ORM integration
- [x] Authentication system with RBAC
- [x] Session management
- [x] Middleware for route protection

### Phase 2 - Customer Interface ✓
- [x] Customer layout with navigation
- [x] Landing page with hero section
- [x] Service category showcase
- [x] Dynamic SEO-friendly event type pages
- [x] Responsive design (mobile-first)

## 🎯 Next Steps

### Phase 3 - Event Planner Wizard
- [ ] Step 1: Event Type Selection
- [ ] Step 2: Event Information Form
- [ ] Step 3: Theme & Color Selection
- [ ] Step 4: Decoration Components Builder
- [ ] Step 5: Package Options & Upgrades
- [ ] Step 6: Budget Calculator
- [ ] Step 7: Date Availability Check
- [ ] Step 8: Review & Submit Quote Request

### Phase 4 - Admin Panel
- [ ] Admin dashboard with KPIs
- [ ] Leads & CRM management
- [ ] Quotation builder & PDF generation
- [ ] Event operations workspace
- [ ] Calendar view with reservations
- [ ] Staff & vendor management
- [ ] Inventory tracking
- [ ] Payment & expense tracking
- [ ] Reports & analytics

### Phase 5 - Package Management
- [ ] Package builder interface
- [ ] Service catalog management
- [ ] Add-on management
- [ ] Theme & color palette editor
- [ ] Media library
- [ ] Pricing configuration

### Phase 6 - Inventory System
- [ ] Inventory item management
- [ ] Category organization
- [ ] Stock level tracking
- [ ] Automatic reservation on booking
- [ ] Damage & loss tracking
- [ ] Low-stock alerts

### Phase 7 - Finance & Reporting
- [ ] Payment recording & verification
- [ ] Expense tracking
- [ ] Profitability calculator
- [ ] Revenue reports
- [ ] Lead conversion analytics
- [ ] Inventory utilization reports

### Phase 8 - Communication
- [ ] Email notifications
- [ ] WhatsApp integration (abstracted)
- [ ] SMS notifications
- [ ] In-app notifications
- [ ] Payment reminders
- [ ] Event reminders

### Phase 9 - Production Hardening
- [ ] Input validation (Zod schemas)
- [ ] Error handling & logging
- [ ] Rate limiting
- [ ] File upload (S3 integration)
- [ ] Image optimization
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing (unit + integration)

### Phase 10 - Deployment
- [ ] Production environment setup
- [ ] Database migration strategy
- [ ] CI/CD pipeline
- [ ] Monitoring & logging
- [ ] Backup strategy
- [ ] Documentation

## 🎨 Design System

### Colors
- **Primary**: Rose/Pink (`rose-600`, `rose-700`)
- **Accent**: Green for WhatsApp CTAs
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, extrabold weights
- **Body**: Regular text with good contrast
- **CTAs**: Semibold, prominent

### Components
- **Buttons**: Rounded-full for primary actions
- **Cards**: Rounded-xl with hover shadows
- **Inputs**: Clean, accessible forms
- **Navigation**: Sticky, responsive

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- HTTP-only session cookies
- Server-side authorization checks
- CSRF protection via SameSite cookies
- SQL injection prevention (Drizzle ORM)
- XSS protection (React escaping)
- Audit logging for sensitive operations
- Role-based permissions

## 📊 Business Logic

### Lead Workflow
```
New Inquiry → Contacted → Qualified → Quotation Sent → 
Negotiation → Won/Lost
```

### Event Workflow
```
Inquiry → Quotation Prepared → Quotation Sent → 
Awaiting Advance → Confirmed → In Preparation → 
Event Day → Completed
```

### Inventory Reservation
When an event is confirmed, required inventory is automatically reserved, updating available quantities and preventing double-booking.

### Quotation Versioning
Quotations are versioned (QT-YYYY-XXXXX-V1, V2, etc.) to preserve pricing history when changes are requested.

## 🌐 SEO-Friendly Routes

All event type pages are SEO-optimized:
- `/wedding-decoration`
- `/pasni-decoration`
- `/birthday-decoration`
- `/anniversary-decoration`
- `/haldi-decoration`
- `/mehendi-decoration`
- `/engagement-decoration`
- `/proposal-setup`
- `/baby-shower-decoration`
- `/corporate-event-decoration`

## 📞 Contact & Support

**11:11 Decoration Nepal**
- Phone: +977-9847411305
- Email: event.eleveneleven@gmail.com
- Location: Jawalakhel, Lalitpur, Nepal
- Website: decorationnepal.com

## 📝 Development Notes

### Database Commands

```bash
# Generate migrations after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Re-seed database
npm run db:seed
```

### Code Style

- Use TypeScript strict mode
- Follow Next.js App Router conventions
- Server Components by default
- Client Components only when needed
- Colocate related files
- Use meaningful variable names
- Comment complex business logic

## 🚧 Known Limitations

- File upload uses local filesystem (S3 integration planned)
- No real-time notifications yet (polling planned)
- WhatsApp integration is abstracted (API integration planned)
- Payment gateway integration pending (Khalti/eSewa)
- Email service not configured (SMTP setup needed)

## 📄 License

Proprietary - 11:11 Decoration Nepal

---

Built with ❤️ for 11:11 Decoration Nepal
