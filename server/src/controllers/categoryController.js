import Category from '../models/Category.js';
import FoodItem from '../models/FoodItem.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: 1 });
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, imageUrl, description, displayOrder } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A category with this name already exists.' });
    }

    const category = await Category.create({
      name,
      slug,
      imageUrl: imageUrl || '',
      description: description || '',
      displayOrder: displayOrder || 0,
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Failed to create category.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, description, displayOrder } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (imageUrl !== undefined) category.imageUrl = imageUrl;
    if (description !== undefined) category.description = description;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    await category.save();
    return res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ message: 'Failed to update category.' });
  }
};

export const reorderCategories = async (req, res) => {
  try {
    const { order } = req.body; // array of { id, displayOrder }
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: 'Order array is required.' });
    }

    await Promise.all(
      order.map(async (item) => {
        await Category.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder });
      })
    );

    const categories = await Category.find().sort({ displayOrder: 1 });
    return res.json(categories);
  } catch (error) {
    console.error('Error reordering categories:', error);
    return res.status(500).json({ message: 'Failed to reorder categories.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const itemCount = await FoodItem.countDocuments({ category: id });

    if (itemCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category: it currently contains ${itemCount} active food item(s). Please reassign or remove them first.`,
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Failed to delete category.' });
  }
};
