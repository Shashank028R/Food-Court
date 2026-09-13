import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    spiceLevel: {
      type: String,
      enum: ['NONE', 'MILD', 'MEDIUM', 'HOT'],
      default: 'NONE',
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: String,
      default: '15-20 min',
    },
    calories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('FoodItem', foodItemSchema);
