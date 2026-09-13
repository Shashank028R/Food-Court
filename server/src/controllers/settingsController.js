import SiteSettings from '../models/SiteSettings.js';

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop', // Artisanal meat & herbs
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop', // Elegant plated pasta
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop', // Vibrant feast table
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1600&auto=format&fit=crop', // Gourmet sourdough pizza
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop', // Decadent dessert
];

export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Food Court',
        tagline: 'An Epicurean Sanctuary of Crafted Delicacies',
        subheadline: 'Immerse your palate in timeless recipes, wood-fired traditions, and farm-to-table culinary artistry.',
        heroImages: DEFAULT_HERO_IMAGES,
      });
    }
    return res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Failed to fetch site settings.' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const { siteName, logoUrl, heroImages, tagline, subheadline, contactPhone, contactEmail, contactAddress, openingHours } = req.body;

    if (siteName !== undefined) settings.siteName = siteName;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (heroImages !== undefined) settings.heroImages = heroImages;
    if (tagline !== undefined) settings.tagline = tagline;
    if (subheadline !== undefined) settings.subheadline = subheadline;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;
    if (openingHours !== undefined) settings.openingHours = openingHours;

    await settings.save();
    return res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Failed to update site settings.' });
  }
};
