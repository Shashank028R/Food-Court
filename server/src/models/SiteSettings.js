import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'Food Court',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'An Epicurean Sanctuary of Crafted Delicacies',
    },
    subheadline: {
      type: String,
      default: 'Immerse your palate in timeless recipes, wood-fired traditions, and farm-to-table culinary artistry.',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    heroImages: {
      type: [String],
      default: [],
    },
    contactPhone: {
      type: String,
      default: '+1 (555) 349-2810',
    },
    contactEmail: {
      type: String,
      default: 'concierge@foodcourt.com',
    },
    contactAddress: {
      type: String,
      default: '440 Heritage Promenade, Suite 100, Culinary District',
    },
    openingHours: {
      type: String,
      default: 'Mon - Sun: 11:00 AM - 11:00 PM',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
