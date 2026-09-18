-- ==========================================
-- 11:11 Decoration Nepal - Database Setup
-- Run this in Supabase SQL Editor
-- ==========================================

-- Users & Authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  phone_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Customers & CRM
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL UNIQUE,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Event Types
CREATE TABLE IF NOT EXISTS event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Themes
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Color Palettes
CREATE TABLE IF NOT EXISTS color_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  colors JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  source VARCHAR(50) NOT NULL,
  event_type_id UUID NOT NULL,
  event_date DATE NOT NULL,
  budget_range VARCHAR(100),
  venue VARCHAR(255),
  assigned_salesperson_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  last_contact_date TIMESTAMP,
  next_follow_up_date TIMESTAMP,
  notes TEXT,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id UUID NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DOUBLE PRECISION NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  images JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  event_types JSONB DEFAULT '[]' NOT NULL,
  pricing_model VARCHAR(50) NOT NULL DEFAULT 'fixed',
  base_price DOUBLE PRECISION NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  cost_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'item' NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  images JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Package Items
CREATE TABLE IF NOT EXISTS package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  service_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  upgrade_price DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Addons
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  cost_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inventory Categories
CREATE TABLE IF NOT EXISTS inventory_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL,
  image TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  damaged_quantity INTEGER NOT NULL DEFAULT 0,
  lost_quantity INTEGER NOT NULL DEFAULT 0,
  purchase_price DOUBLE PRECISION DEFAULT 0,
  current_value DOUBLE PRECISION DEFAULT 0,
  storage_location VARCHAR(255),
  condition VARCHAR(50) DEFAULT 'good' NOT NULL,
  minimum_stock_level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Service Inventory Requirements
CREATE TABLE IF NOT EXISTS service_inventory_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL,
  inventory_item_id UUID NOT NULL,
  required_quantity INTEGER NOT NULL DEFAULT 1
);

-- Quotations
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  quotation_number VARCHAR(50) NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  customer_id UUID NOT NULL REFERENCES customers(id),
  subtotal DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  transportation_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  tax_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  advance_required DOUBLE PRECISION NOT NULL DEFAULT 0,
  terms_and_conditions TEXT,
  valid_until DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  whatsapp_sent BOOLEAN NOT NULL DEFAULT false,
  whatsapp_sent_at TIMESTAMP,
  client_feedback TEXT,
  internal_costs DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMP;
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Quotation Items
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  service_id UUID,
  addon_id UUID,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit VARCHAR(50) DEFAULT 'item' NOT NULL,
  unit_price DOUBLE PRECISION NOT NULL,
  cost_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  total_price DOUBLE PRECISION NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(50) NOT NULL UNIQUE,
  lead_id UUID NOT NULL REFERENCES leads(id),
  quotation_id UUID NOT NULL REFERENCES quotations(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  name VARCHAR(255) NOT NULL,
  event_type_id UUID NOT NULL REFERENCES event_types(id),
  event_date DATE NOT NULL,
  start_time VARCHAR(50),
  end_time VARCHAR(50),
  venue VARCHAR(255) NOT NULL,
  venue_address TEXT,
  guest_count INTEGER,
  theme_id UUID REFERENCES themes(id),
  color_palette_id UUID REFERENCES color_palettes(id),
  special_instructions TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'inquiry',
  coordinator_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Inventory Reservations
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL,
  reserved_quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Checklists
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id UUID NOT NULL,
  task_template_name VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Event Checklists
CREATE TABLE IF NOT EXISTS event_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMP,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Staff Assignments
CREATE TABLE IF NOT EXISTS staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  service_type VARCHAR(100) NOT NULL,
  pricing_details TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Event Vendors
CREATE TABLE IF NOT EXISTS event_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  quoted_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
  actual_paid DOUBLE PRECISION NOT NULL DEFAULT 0,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  notes TEXT
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  amount DOUBLE PRECISION NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_reference VARCHAR(100),
  payment_proof_url TEXT,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  category VARCHAR(100) NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  paid_to VARCHAR(255),
  payment_method VARCHAR(50) NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Moodboards
CREATE TABLE IF NOT EXISTS moodboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  event_id UUID,
  name VARCHAR(255) NOT NULL DEFAULT 'Moodboard',
  images JSONB DEFAULT '[]' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  images JSONB DEFAULT '[]' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  tags JSONB DEFAULT '[]' NOT NULL,
  category VARCHAR(100),
  view_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed Admin User (password: admin123)
INSERT INTO users (name, email, password_hash, role, is_active, phone_number)
VALUES ('Super Admin', 'admin@decorationnepal.com', '$2b$10$AMRIx/fXH2Yao5dcSmsU8OmejMpvd2CTJTHFzLuzH/pNs8zU0qbQK', 'super_admin', true, '+977-9847411305')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, role, is_active, phone_number)
VALUES ('Sales Manager', 'sales@decorationnepal.com', '$2b$10$cAjatY6RE2Ne5nLBgEC1ie9JEUFpxWyrXL/xeqIUzLwTI7XIiKUte', 'sales_manager', true, '+977-9800000001')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, role, is_active, phone_number)
VALUES ('Event Coordinator', 'coordinator@decorationnepal.com', '$2b$10$MZSDJO/LNTJaVNe2kMMuHe/R875YxtXjm.QvFDacXUokOjpASzTLG', 'event_coordinator', true, '+977-9800000002')
ON CONFLICT (email) DO NOTHING;

-- Seed Event Types
INSERT INTO event_types (name, slug, description, is_active) VALUES
('Wedding', 'wedding-decoration', 'Complete wedding decoration services including mandap, stage, and entrance decoration', true),
('Pasni', 'pasni-decoration', 'Traditional Pasni ceremony decoration with cultural elements', true),
('Birthday', 'birthday-decoration', 'Creative birthday party decorations for all ages', true),
('Anniversary', 'anniversary-decoration', 'Romantic anniversary decoration setups', true),
('Haldi', 'haldi-decoration', 'Vibrant Haldi ceremony decorations', true),
('Mehendi', 'mehendi-decoration', 'Colorful Mehendi ceremony decorations', true),
('Engagement', 'engagement-decoration', 'Beautiful engagement ceremony decorations', true),
('Proposal', 'proposal-setup', 'Romantic proposal setups and surprise planning', true),
('Baby Shower', 'baby-shower-decoration', 'Adorable baby shower decorations', true),
('Corporate Event', 'corporate-event-decoration', 'Professional corporate event decoration', true)
ON CONFLICT (name) DO NOTHING;

-- Seed Themes
INSERT INTO themes (name, description, is_active) VALUES
('Traditional', 'Classic traditional Nepali style', true),
('Modern', 'Contemporary and minimalist', true),
('Royal', 'Luxurious and grand setup', true),
('Elegant', 'Sophisticated and refined', true),
('Rustic', 'Natural and earthy elements', true),
('Boho', 'Bohemian and free-spirited', true),
('Pastel', 'Soft pastel color themes', true),
('Minimal', 'Simple and clean aesthetic', true),
('Floral', 'Flower-centric decorations', true),
('Luxury', 'High-end premium setup', true)
ON CONFLICT (name) DO NOTHING;

-- Seed Color Palettes
INSERT INTO color_palettes (name, colors) VALUES
('Red & Gold', '["#DC143C", "#FFD700"]'),
('White & Green', '["#FFFFFF", "#228B22"]'),
('Pastel Pink', '["#FFB6C1", "#FFC0CB", "#FFE4E1"]'),
('Royal Blue & Gold', '["#4169E1", "#FFD700"]'),
('Maroon & Gold', '["#800000", "#FFD700"]'),
('Purple & Silver', '["#800080", "#C0C0C0"]'),
('Peach & Ivory', '["#FFDAB9", "#FFFFF0"]'),
('Mint Green', '["#98FF98", "#F0FFF0"]')
ON CONFLICT (name) DO NOTHING;

-- Seed Inventory Categories
INSERT INTO inventory_categories (name) VALUES
('Flowers'), ('Curtains'), ('Lighting'), ('Furniture'), ('Props'),
('Backdrop'), ('Balloons'), ('Stage Equipment'), ('Mandap Structures'), ('Decorative Items')
ON CONFLICT (name) DO NOTHING;

-- Seed Vendors
INSERT INTO vendors (name, contact_person, phone, email, service_type, pricing_details, is_active, rating) VALUES
('Royal Caterers Nepal', 'Ram Prasad', '+977-9800111111', 'info@royalcaterers.com', 'Catering', 'Rs. 500-1500 per plate', true, 4.5),
('Kathmandu Florist', 'Sita Sharma', '+977-9800222222', 'kathmanduflorist@gmail.com', 'Florist', 'Fresh flower arrangements', true, 4.8),
('Elite Photography', 'Hari Thapa', '+977-9800333333', 'elite@photography.com', 'Photography', 'Rs. 25,000-100,000 per event', true, 4.7),
('Makeup by Divya', 'Divya Rana', '+977-9800444444', 'divyamakeup@gmail.com', 'Makeup', 'Rs. 5,000-15,000', true, 4.9)
ON CONFLICT DO NOTHING;

SELECT 'SUCCESS: All 30+ tables created and seeded!' as result;
