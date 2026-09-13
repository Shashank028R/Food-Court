import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import Category from './models/Category.js';
import FoodItem from './models/FoodItem.js';
import User from './models/User.js';
import SiteSettings from './models/SiteSettings.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed]: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed]: Connected successfully.');

    // Clear existing data
    await Category.deleteMany({});
    await FoodItem.deleteMany({});
    await User.deleteMany({});
    await SiteSettings.deleteMany({});
    console.log('[Seed]: Cleared existing collections.');

    // 1. Seed Users (Admin & Sample Customer)
    const adminSalt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', adminSalt);
    const adminUser = await User.create({
      name: 'Chef & Owner (Admin)',
      email: 'admin@foodcourt.com',
      passwordHash: adminPasswordHash,
      phone: '+1 (555) 349-2810',
      address: '440 Heritage Promenade, Suite 100',
      role: 'ADMIN',
    });

    const custSalt = await bcrypt.genSalt(10);
    const custPasswordHash = await bcrypt.hash('Customer@123', custSalt);
    const customerUser = await User.create({
      name: 'Alexander Wright',
      email: 'alexander@example.com',
      passwordHash: custPasswordHash,
      phone: '+1 (555) 782-9014',
      address: '742 Evergreen Terrace, Apt 4B',
      role: 'CUSTOMER',
    });

    console.log('[Seed]: Created Admin and Customer accounts.');

    // 2. Seed Site Settings
    const heroImages = [
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop', // Prime roasted rack
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop', // Artisanal pasta
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop', // Gourmet harvest spread
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1600&auto=format&fit=crop', // Woodfired sourdough pizza
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop', // Signature dessert
    ];

    await SiteSettings.create({
      siteName: 'Food Court',
      tagline: 'An Epicurean Sanctuary of Crafted Delicacies',
      subheadline: 'Immerse your palate in timeless recipes, wood-fired traditions, and farm-to-table culinary artistry.',
      logoUrl: '', // uses editorial text wordmark
      heroImages,
      contactPhone: '+1 (555) 349-2810',
      contactEmail: 'concierge@foodcourt.com',
      contactAddress: '440 Heritage Promenade, Suite 100, Culinary District',
      openingHours: 'Monday - Sunday: 11:00 AM - 11:00 PM',
    });
    console.log('[Seed]: Initialized Site Settings.');

    // 3. Seed Categories
    const categoriesData = [
      {
        name: 'Starters & Small Plates',
        slug: 'starters',
        displayOrder: 1,
        description: 'Delicate beginnings crafted with seasonal herbs and artisanal cheeses.',
        imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Main Course Specialties',
        slug: 'mains',
        displayOrder: 2,
        description: 'Slow-roasted meats, handcrafted pasta, and vibrant coastal creations.',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Artisanal Breads & Sides',
        slug: 'breads-sides',
        displayOrder: 3,
        description: 'Naturally leavened loaves, truffle fries, and hearth-baked accompaniments.',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
      },
      {
        name: 'Desserts & Refreshers',
        slug: 'desserts',
        displayOrder: 4,
        description: 'Silken mousses, glazed tarts, and botanically infused botanical elixirs.',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });
    console.log('[Seed]: Created Categories.');

    // 4. Seed 16+ Food Items
    const foodItemsData = [
      // STARTERS
      {
        name: 'Wild Forest Truffle Arancini',
        slug: 'wild-forest-truffle-arancini',
        description: 'Crisp saffron arborio spheres stuffed with smoked fior di latte, black winter truffle emulsion, and aged Parmigiano.',
        price: 16.5,
        imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
        category: catMap['starters'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '12-15 min',
        calories: 380,
      },
      {
        name: 'Heritage Burrata & Heirloom Peach',
        slug: 'heritage-burrata-heirloom-peach',
        description: 'Pugliese creamy burrata paired with wood-grilled Georgia peaches, wild rocket, 18-year Modena balsamic, and roasted pine nuts.',
        price: 18.0,
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?q=80&w=800&auto=format&fit=crop',
        category: catMap['starters'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '10 min',
        calories: 320,
      },
      {
        name: 'Spiced Iberian Crispy Calamari',
        slug: 'spiced-iberian-crispy-calamari',
        description: 'Tender Monterey squid flash-fried with crushed Espelette pepper, preserved Meyer lemon aioli, and charred scallion vinaigrette.',
        price: 19.5,
        imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
        category: catMap['starters'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'MILD',
        isVeg: false,
        preparationTime: '12 min',
        calories: 420,
      },
      {
        name: 'Smoked Harissa Cauliflower Steak',
        slug: 'smoked-harissa-cauliflower-steak',
        description: 'Cast-iron seared cauliflower marinated in housemade rose harissa, whipped tahini yogurt, pomegranate jewels, and toasted pepitas.',
        price: 15.0,
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
        category: catMap['starters'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'MEDIUM',
        isVeg: true,
        preparationTime: '14 min',
        calories: 260,
      },

      // MAINS
      {
        name: 'Prime Herb-Crusted Lamb Rack',
        slug: 'prime-herb-crusted-lamb-rack',
        description: 'Pasture-raised New Zealand lamb crusted with rosemary-garlic panko, parsnip mousseline, baby glazed carrots, and dark cherry jus.',
        price: 38.5,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: true,
        isTodaysSpecial: true,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: false,
        preparationTime: '25 min',
        calories: 680,
      },
      {
        name: 'Hand-Rolled Truffle Tagliatelle',
        slug: 'hand-rolled-truffle-tagliatelle',
        description: 'Silken housemade egg pasta folded into cultured Normandy butter, foraged morel mushrooms, shaved autumn truffles, and Reggiano cream.',
        price: 29.0,
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '18 min',
        calories: 540,
      },
      {
        name: 'Chilean Sea Bass Puttanesca',
        slug: 'chilean-sea-bass-puttanesca',
        description: 'Pan-roasted wild sea bass fillet in San Marzano tomato broth, Castelvetrano olives, caper berries, and fresh sweet basil.',
        price: 36.0,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: false,
        isTodaysSpecial: true,
        isAvailable: true,
        spiceLevel: 'MILD',
        isVeg: false,
        preparationTime: '22 min',
        calories: 490,
      },
      {
        name: 'Slow-Braised Wagyu Short Rib',
        slug: 'slow-braised-wagyu-short-rib',
        description: 'Twelve-hour braised beef short rib in vintage Cabernet reduction, velvety polenta concia, and roasted cipollini onions.',
        price: 39.0,
        imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: false,
        preparationTime: '20 min',
        calories: 720,
      },
      {
        name: 'Fire-Roasted Poblano & Sweet Corn Risotto',
        slug: 'fire-roasted-poblano-risotto',
        description: 'Carnaroli rice simmered in sweet corn broth with charred poblano chiles, cotija cheese, roasted summer squash, and cilantro oil.',
        price: 25.5,
        imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'MEDIUM',
        isVeg: true,
        preparationTime: '20 min',
        calories: 480,
      },
      {
        name: 'Spicy Calabrian Prawn Tagliolini',
        slug: 'spicy-calabrian-prawn-tagliolini',
        description: 'Jumbo wild prawns tossed with fiery Calabrian chile paste, garlic-infused extra virgin olive oil, sweet cherry tomatoes, and pangrattato.',
        price: 31.0,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
        category: catMap['mains'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'HOT',
        isVeg: false,
        preparationTime: '16 min',
        calories: 520,
      },

      // BREADS & SIDES
      {
        name: 'Heirloom Sourdough & Whipped Honey Butter',
        slug: 'heirloom-sourdough-whipped-honey-butter',
        description: 'Thick slices of 36-hour slow fermented sourdough bread served warm with smoked sea salt butter and wild wildflower honey.',
        price: 9.5,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
        category: catMap['breads-sides'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '5 min',
        calories: 290,
      },
      {
        name: 'Crisp Truffle & Rosemary Hand-Cut Fries',
        slug: 'truffle-rosemary-fries',
        description: 'Double-fried Idaho Russet potatoes tossed with black truffle oil, fresh minced rosemary, sea salt, and roasted garlic aioli.',
        price: 11.5,
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
        category: catMap['breads-sides'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '10 min',
        calories: 380,
      },
      {
        name: 'Cast-Iron Garlic Rosemary Focaccia',
        slug: 'cast-iron-garlic-rosemary-focaccia',
        description: 'Hearth-baked Genovese focaccia dimpled with roasted garlic cloves, fresh rosemary sprigs, and green Sicilian olive oil.',
        price: 10.0,
        imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=800&auto=format&fit=crop',
        category: catMap['breads-sides'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '8 min',
        calories: 310,
      },

      // DESSERTS & REFRESHERS
      {
        name: 'Dark Valrhona Chocolate Fondant',
        slug: 'dark-valrhona-chocolate-fondant',
        description: 'Molten chocolate cake crafted with 72% Valrhona single-origin cocoa, Tahitian vanilla bean gelato, and caramelized cocoa nibs.',
        price: 14.5,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
        category: catMap['desserts'],
        isPopular: true,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '15 min',
        calories: 450,
      },
      {
        name: 'Amalfi Meyer Lemon & Basil Tart',
        slug: 'amalfi-lemon-basil-tart',
        description: 'Crisp almond sablé crust filled with zesty lemon curd, lightly torched Italian meringue, and candied basil leaves.',
        price: 13.0,
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
        category: catMap['desserts'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '8 min',
        calories: 340,
      },
      {
        name: 'Botanical Blackberry & Thyme Elixir',
        slug: 'botanical-blackberry-thyme-elixir',
        description: 'Muddled mountain blackberries, garden thyme infusion, sparkling mineral water, splash of fresh lime, and organic agave nectar.',
        price: 8.5,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
        category: catMap['desserts'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '5 min',
        calories: 110,
      },
      {
        name: 'Matcha Jasmine Blossom Affogato',
        slug: 'matcha-jasmine-blossom-affogato',
        description: 'Ceremonial grade Uji matcha poured tableside over handcrafted Madagascar vanilla gelato with toasted black sesame crisps.',
        price: 11.0,
        imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800&auto=format&fit=crop',
        category: catMap['desserts'],
        isPopular: false,
        isTodaysSpecial: false,
        isAvailable: true,
        spiceLevel: 'NONE',
        isVeg: true,
        preparationTime: '6 min',
        calories: 220,
      },
    ];

    await FoodItem.insertMany(foodItemsData);
    console.log(`[Seed]: Created ${foodItemsData.length} Food Items.`);

    console.log('\n=============================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Login:    admin@foodcourt.com / Admin@12345');
    console.log('Customer Login: alexander@example.com / Customer@123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
