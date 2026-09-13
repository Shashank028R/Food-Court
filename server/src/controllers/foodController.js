import FoodItem from '../models/FoodItem.js';
import Category from '../models/Category.js';

export const getFoodItems = async (req, res) => {
  try {
    const { popular, special, category, search, veg, spiceLevel } = req.query;
    const filter = {};

    if (popular === 'true') filter.isPopular = true;
    if (special === 'true') filter.isTodaysSpecial = true;

    if (veg !== undefined && veg !== '') {
      filter.isVeg = veg === 'true';
    }

    if (spiceLevel && spiceLevel !== 'ALL') {
      filter.spiceLevel = spiceLevel.toUpperCase();
    }

    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const items = await FoodItem.find(filter)
      .populate('category', 'name slug')
      .sort({ isTodaysSpecial: -1, isPopular: -1, createdAt: -1 });

    return res.json(items);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return res.status(500).json({ message: 'Failed to fetch food items.' });
  }
};

export const getFoodItemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const item = await FoodItem.findOne({
      $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    }).populate('category', 'name slug');

    if (!item) {
      return res.status(404).json({ message: 'Food item not found.' });
    }

    return res.json(item);
  } catch (error) {
    console.error('Error fetching food item:', error);
    return res.status(500).json({ message: 'Failed to fetch food item.' });
  }
};

export const createFoodItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      category,
      isPopular,
      isTodaysSpecial,
      isAvailable,
      spiceLevel,
      isVeg,
      preparationTime,
      calories,
    } = req.body;

    if (!name || !price || !imageUrl || !category) {
      return res.status(400).json({ message: 'Name, price, category, and image URL are required.' });
    }

    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await FoodItem.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newItem = await FoodItem.create({
      name,
      slug,
      description: description || '',
      price: Number(price),
      imageUrl,
      category,
      isPopular: Boolean(isPopular),
      isTodaysSpecial: Boolean(isTodaysSpecial),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      spiceLevel: spiceLevel || 'NONE',
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      preparationTime: preparationTime || '15-20 min',
      calories: calories ? Number(calories) : 0,
    });

    const populated = await FoodItem.findById(newItem._id).populate('category', 'name slug');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating food item:', error);
    return res.status(500).json({ message: 'Failed to create food item.' });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    const item = await FoodItem.findByIdAndUpdate(id, updates, { new: true }).populate('category', 'name slug');

    if (!item) {
      return res.status(404).json({ message: 'Food item not found.' });
    }

    return res.json(item);
  } catch (error) {
    console.error('Error updating food item:', error);
    return res.status(500).json({ message: 'Failed to update food item.' });
  }
};

export const toggleFoodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // 'isPopular', 'isTodaysSpecial', 'isAvailable'

    if (!['isPopular', 'isTodaysSpecial', 'isAvailable'].includes(field)) {
      return res.status(400).json({ message: 'Invalid toggle field.' });
    }

    const item = await FoodItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found.' });
    }

    item[field] = !item[field];
    await item.save();

    return res.json({ [field]: item[field], message: `${field} updated.` });
  } catch (error) {
    console.error('Error toggling status:', error);
    return res.status(500).json({ message: 'Failed to toggle status.' });
  }
};

export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FoodItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Food item not found.' });
    }

    return res.json({ message: 'Food item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return res.status(500).json({ message: 'Failed to delete food item.' });
  }
};
