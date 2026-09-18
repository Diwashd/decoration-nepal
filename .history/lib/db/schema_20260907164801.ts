import {
  pgTable,
  text,
  integer,
  doublePrecision,
  timestamp,
  boolean,
  uuid,
  varchar,
  date,
  jsonb
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users & Authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('staff'),
  isActive: boolean('is_active').notNull().default(true),
  phoneNumber: varchar('phone_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customers & CRM
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull().unique(),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'restrict' }),
  source: varchar('source', { length: 50 }).notNull(),
  eventTypeId: uuid('event_type_id').notNull(),
  eventDate: date('event_date').notNull(),
  budgetRange: varchar('budget_range', { length: 100 }),
  venue: varchar('venue', { length: 255 }),
  assignedSalespersonId: uuid('assigned_salesperson_id').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  lastContactDate: timestamp('last_contact_date'),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  notes: text('notes'),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product Catalog
export const eventTypes = pgTable('event_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  image: text('image'),
  isActive: boolean('is_active').notNull().default(true),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const themes = pgTable('themes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const colorPalettes = pgTable('color_palettes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  colors: jsonb('colors').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const packages = pgTable('packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventTypeId: uuid('event_type_id').references(() => eventTypes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  basePrice: doublePrecision('base_price').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  images: jsonb('images').default('[]').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  eventTypes: jsonb('event_types').default('[]').notNull(),
  pricingModel: varchar('pricing_model', { length: 50 }).notNull().default('fixed'),
  basePrice: doublePrecision('base_price').notNull(),
  costPrice: doublePrecision('cost_price').notNull().default(0),
  unit: varchar('unit', { length: 50 }).default('item').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  images: jsonb('images').default('[]').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const packageItems = pgTable('package_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  packageId: uuid('package_id').references(() => packages.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'restrict' }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  isOptional: boolean('is_optional').notNull().default(false),
  upgradePrice: doublePrecision('upgrade_price').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const addons = pgTable('addons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: doublePrecision('price').notNull(),
  costPrice: doublePrecision('cost_price').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Inventory Management
export const inventoryCategories = pgTable('inventory_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: uuid('category_id').references(() => inventoryCategories.id, { onDelete: 'restrict' }).notNull(),
  image: text('image'),
  quantity: integer('quantity').notNull().default(0),
  damagedQuantity: integer('damaged_quantity').notNull().default(0),
  lostQuantity: integer('lost_quantity').notNull().default(0),
  purchasePrice: doublePrecision('purchase_price').default(0),
  currentValue: doublePrecision('current_value').default(0),
  storageLocation: varchar('storage_location', { length: 255 }),
  condition: varchar('condition', { length: 50 }).default('good').notNull(),
  minimumStockLevel: integer('minimum_stock_level').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const serviceInventoryRequirements = pgTable('service_inventory_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  inventoryItemId: uuid('inventory_item_id').references(() => inventoryItems.id, { onDelete: 'restrict' }).notNull(),
  requiredQuantity: integer('required_quantity').notNull().default(1),
});

// Quotations
export const quotations = pgTable('quotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'restrict' }).notNull(),
  quotationNumber: varchar('quotation_number', { length: 50 }).notNull().unique(),
  version: integer('version').notNull().default(1),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'restrict' }).notNull(),
  subtotal: doublePrecision('subtotal').notNull().default(0),
  discountAmount: doublePrecision('discount_amount').notNull().default(0),
  transportationCost: doublePrecision('transportation_cost').notNull().default(0),
  taxAmount: doublePrecision('tax_amount').notNull().default(0),
  totalAmount: doublePrecision('total_amount').notNull().default(0),
  advanceRequired: doublePrecision('advance_required').notNull().default(0),
  termsAndConditions: text('terms_and_conditions'),
  validUntil: date('valid_until'),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  whatsappSent: boolean('whatsapp_sent').notNull().default(false),
  whatsappSentAt: timestamp('whatsapp_sent_at'),
  clientFeedback: text('client_feedback'),
  internalCosts: doublePrecision('internal_costs').notNull().default(0),
  createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  quotationId: uuid('quotation_id').references(() => quotations.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id),
  addonId: uuid('addon_id').references(() => addons.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  unit: varchar('unit', { length: 50 }).default('item').notNull(),
  unitPrice: doublePrecision('unit_price').notNull(),
  costPrice: doublePrecision('cost_price').default(0).notNull(),
  totalPrice: doublePrecision('total_price').notNull(),
  isCustom: boolean('is_custom').notNull().default(false),
});

// Events & Operations
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: varchar('event_id', { length: 50 }).notNull().unique(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'restrict' }).notNull(),
  quotationId: uuid('quotation_id').references(() => quotations.id, { onDelete: 'restrict' }).notNull(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'restrict' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  eventTypeId: uuid('event_type_id').references(() => eventTypes.id).notNull(),
  eventDate: date('event_date').notNull(),
  startTime: varchar('start_time', { length: 50 }),
  endTime: varchar('end_time', { length: 50 }),
  venue: varchar('venue', { length: 255 }).notNull(),
  venueAddress: text('venue_address'),
  guestCount: integer('guest_count'),
  themeId: uuid('theme_id').references(() => themes.id),
  colorPaletteId: uuid('color_palette_id').references(() => colorPalettes.id),
  specialInstructions: text('special_instructions'),
  status: varchar('status', { length: 50 }).notNull().default('inquiry'),
  coordinatorId: uuid('coordinator_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventoryReservations = pgTable('inventory_reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  inventoryItemId: uuid('inventory_item_id').references(() => inventoryItems.id, { onDelete: 'restrict' }).notNull(),
  reservedQuantity: integer('reserved_quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const checklists = pgTable('checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventTypeId: uuid('event_type_id').references(() => eventTypes.id, { onDelete: 'cascade' }).notNull(),
  taskTemplateName: varchar('task_template_name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const eventChecklists = pgTable('event_checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  dueDate: timestamp('due_date'),
  sortOrder: integer('sort_order').default(0).notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const staffAssignments = pgTable('staff_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Vendors
export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  serviceType: varchar('service_type', { length: 100 }).notNull(),
  pricingDetails: text('pricing_details'),
  isActive: boolean('is_active').notNull().default(true),
  rating: doublePrecision('rating'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const eventVendors = pgTable('event_vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'restrict' }).notNull(),
  quotedCost: doublePrecision('quoted_cost').notNull().default(0),
  actualPaid: doublePrecision('actual_paid').notNull().default(0),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('unpaid'),
  notes: text('notes'),
});

// Finance
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'restrict' }).notNull(),
  amount: doublePrecision('amount').notNull(),
  paymentDate: date('payment_date').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  transactionReference: varchar('transaction_reference', { length: 100 }),
  paymentProofUrl: text('payment_proof_url'),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  amount: doublePrecision('amount').notNull(),
  expenseDate: date('expense_date').notNull(),
  description: text('description'),
  paidTo: varchar('paid_to', { length: 255 }),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Client Interaction
export const moodboards = pgTable('moodboards', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull().default('Moodboard'),
  images: jsonb('images').default('[]').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'restrict' }).notNull(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'restrict' }).notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  isApproved: boolean('is_approved').notNull().default(false),
  images: jsonb('images').default('[]').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// System
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 255 }).notNull(),
  tableName: varchar('table_name', { length: 100 }),
  recordId: uuid('record_id'),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const systemSettings = pgTable('system_settings', {
  id: varchar('id', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('info'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedLeads: many(leads),
  createdQuotes: many(quotations),
  assignments: many(staffAssignments),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  leads: many(leads),
  quotations: many(quotations),
  events: many(events),
  moodboards: many(moodboards),
  reviews: many(reviews),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  customer: one(customers, {
    fields: [leads.customerId],
    references: [customers.id],
  }),
  eventType: one(eventTypes, {
    fields: [leads.eventTypeId],
    references: [eventTypes.id],
  }),
  assignedSalesperson: one(users, {
    fields: [leads.assignedSalespersonId],
    references: [users.id],
  }),
  quotations: many(quotations),
  events: many(events),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  eventType: one(eventTypes, {
    fields: [packages.eventTypeId],
    references: [eventTypes.id],
  }),
  packageItems: many(packageItems),
}));

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  lead: one(leads, {
    fields: [quotations.leadId],
    references: [leads.id],
  }),
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [quotations.createdById],
    references: [users.id],
  }),
  items: many(quotationItems),
  events: many(events),
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationItems.quotationId],
    references: [quotations.id],
  }),
  service: one(services, {
    fields: [quotationItems.serviceId],
    references: [services.id],
  }),
  addon: one(addons, {
    fields: [quotationItems.addonId],
    references: [addons.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  customer: one(customers, {
    fields: [events.customerId],
    references: [customers.id],
  }),
  lead: one(leads, {
    fields: [events.leadId],
    references: [leads.id],
  }),
  quotation: one(quotations, {
    fields: [events.quotationId],
    references: [quotations.id],
  }),
  eventType: one(eventTypes, {
    fields: [events.eventTypeId],
    references: [eventTypes.id],
  }),
  coordinator: one(users, {
    fields: [events.coordinatorId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [events.themeId],
    references: [themes.id],
  }),
  colorPalette: one(colorPalettes, {
    fields: [events.colorPaletteId],
    references: [colorPalettes.id],
  }),
  inventoryReservations: many(inventoryReservations),
  checklistItems: many(eventChecklists),
  staffAssignments: many(staffAssignments),
  vendors: many(eventVendors),
  payments: many(payments),
  expenses: many(expenses),
  reviews: many(reviews),
}));

// Blog
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  tags: jsonb('tags').default('[]').notNull(),
  category: varchar('category', { length: 100 }),
  viewCount: integer('view_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
