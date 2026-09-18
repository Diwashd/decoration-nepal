import bcrypt from 'bcryptjs';
import { db } from './index';
import { users, customers, eventTypes, themes, colorPalettes, inventoryCategories, vendors } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.insert(users).values([
      {
        name: 'Super Admin',
        email: 'admin@decorationnepal.com',
        passwordHash: hashedPassword,
        role: 'super_admin',
        phoneNumber: '+977-9847411305',
        isActive: true,
      },
      {
        name: 'Sales Manager',
        email: 'sales@decorationnepal.com',
        passwordHash: await bcrypt.hash('sales123', 10),
        role: 'sales_manager',
        phoneNumber: '+977-9800000001',
        isActive: true,
      },
      {
        name: 'Event Coordinator',
        email: 'coordinator@decorationnepal.com',
        passwordHash: await bcrypt.hash('coordinator123', 10),
        role: 'event_coordinator',
        phoneNumber: '+977-9800000002',
        isActive: true,
      },
    ]);

    console.log('✓ Users created');

    // Event Types
    await db.insert(eventTypes).values([
      {
        name: 'Wedding',
        slug: 'wedding-decoration',
        description: 'Complete wedding decoration services including mandap, stage, and entrance decoration',
        isActive: true,
        seoTitle: 'Wedding Decoration in Nepal | 11:11 Decoration',
        seoDescription: 'Professional wedding decoration services in Nepal. Mandap, stage, entrance decoration and more.',
      },
      {
        name: 'Pasni',
        slug: 'pasni-decoration',
        description: 'Traditional Pasni ceremony decoration with cultural elements',
        isActive: true,
        seoTitle: 'Pasni Decoration in Nepal | Traditional Ceremony',
        seoDescription: 'Beautiful Pasni decoration services across Nepal.',
      },
      {
        name: 'Birthday',
        slug: 'birthday-decoration',
        description: 'Creative birthday party decorations for all ages',
        isActive: true,
        seoTitle: 'Birthday Decoration in Nepal | Party Planning',
        seoDescription: 'Make birthdays memorable with our decoration services.',
      },
      {
        name: 'Anniversary',
        slug: 'anniversary-decoration',
        description: 'Romantic anniversary decoration setups',
        isActive: true,
        seoTitle: 'Anniversary Decoration in Nepal | Romantic Setup',
        seoDescription: 'Celebrate love with our anniversary decoration services.',
      },
      {
        name: 'Haldi',
        slug: 'haldi-decoration',
        description: 'Vibrant Haldi ceremony decorations',
        isActive: true,
      },
      {
        name: 'Mehendi',
        slug: 'mehendi-decoration',
        description: 'Colorful Mehendi ceremony decorations',
        isActive: true,
      },
      {
        name: 'Engagement',
        slug: 'engagement-decoration',
        description: 'Beautiful engagement ceremony decorations',
        isActive: true,
      },
      {
        name: 'Proposal',
        slug: 'proposal-setup',
        description: 'Romantic proposal setups and surprise planning',
        isActive: true,
      },
      {
        name: 'Baby Shower',
        slug: 'baby-shower-decoration',
        description: 'Adorable baby shower decorations',
        isActive: true,
      },
      {
        name: 'Corporate Event',
        slug: 'corporate-event-decoration',
        description: 'Professional corporate event decoration',
        isActive: true,
      },
    ]);

    console.log('✓ Event types created');

    // Themes
    await db.insert(themes).values([
      { name: 'Traditional', description: 'Classic traditional Nepali style' },
      { name: 'Modern', description: 'Contemporary and minimalist' },
      { name: 'Royal', description: 'Luxurious and grand setup' },
      { name: 'Elegant', description: 'Sophisticated and refined' },
      { name: 'Rustic', description: 'Natural and earthy elements' },
      { name: 'Boho', description: 'Bohemian and free-spirited' },
      { name: 'Pastel', description: 'Soft pastel color themes' },
      { name: 'Minimal', description: 'Simple and clean aesthetic' },
      { name: 'Floral', description: 'Flower-centric decorations' },
      { name: 'Luxury', description: 'High-end premium setup' },
    ]);

    console.log('✓ Themes created');

    // Color Palettes
    await db.insert(colorPalettes).values([
      { name: 'Red & Gold', colors: ['#DC143C', '#FFD700'] },
      { name: 'White & Green', colors: ['#FFFFFF', '#228B22'] },
      { name: 'Pastel Pink', colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1'] },
      { name: 'Royal Blue & Gold', colors: ['#4169E1', '#FFD700'] },
      { name: 'Maroon & Gold', colors: ['#800000', '#FFD700'] },
      { name: 'Purple & Silver', colors: ['#800080', '#C0C0C0'] },
      { name: 'Peach & Ivory', colors: ['#FFDAB9', '#FFFFF0'] },
      { name: 'Mint Green', colors: ['#98FF98', '#F0FFF0'] },
    ]);

    console.log('✓ Color palettes created');

    // Inventory Categories
    await db.insert(inventoryCategories).values([
      { name: 'Flowers' },
      { name: 'Curtains' },
      { name: 'Lighting' },
      { name: 'Furniture' },
      { name: 'Props' },
      { name: 'Backdrop' },
      { name: 'Balloons' },
      { name: 'Stage Equipment' },
      { name: 'Mandap Structures' },
      { name: 'Decorative Items' },
    ]);

    console.log('✓ Inventory categories created');

    // Vendors
    await db.insert(vendors).values([
      {
        name: 'Royal Caterers Nepal',
        contactPerson: 'Ram Prasad',
        phone: '+977-9800111111',
        email: 'info@royalcaterers.com',
        serviceType: 'Catering',
        pricingDetails: 'Rs. 500-1500 per plate',
        isActive: true,
        rating: 4.5,
      },
      {
        name: 'Kathmandu Florist',
        contactPerson: 'Sita Sharma',
        phone: '+977-9800222222',
        email: 'kathmanduflorist@gmail.com',
        serviceType: 'Florist',
        pricingDetails: 'Fresh flower arrangements',
        isActive: true,
        rating: 4.8,
      },
      {
        name: 'Elite Photography',
        contactPerson: 'Hari Thapa',
        phone: '+977-9800333333',
        email: 'elite@photography.com',
        serviceType: 'Photography',
        pricingDetails: 'Rs. 25,000-100,000 per event',
        isActive: true,
        rating: 4.7,
      },
      {
        name: 'Makeup by Divya',
        contactPerson: 'Divya Rana',
        phone: '+977-9800444444',
        email: 'divyamakeup@gmail.com',
        serviceType: 'Makeup',
        pricingDetails: 'Rs. 5,000-15,000',
        isActive: true,
        rating: 4.9,
      },
    ]);

    console.log('✓ Vendors created');

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('Email: admin@decorationnepal.com');
    console.log('Password: admin123\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }

  process.exit(0);
}

seed();
