import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone, customerName, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!deliveryAddress || !phone) {
      return res.status(400).json({ message: 'Delivery address and phone number are required.' });
    }

    // Verify and snapshot items
    const snapshotItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId || item._id);
      if (!food) {
        return res.status(400).json({ message: `Food item not found: ${item.name || item.foodItemId}` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const lineTotal = food.price * qty;
      calculatedTotal += lineTotal;

      snapshotItems.push({
        foodItem: food._id,
        name: food.name,
        price: food.price,
        quantity: qty,
        imageUrl: food.imageUrl,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: snapshotItems,
      totalPrice: calculatedTotal,
      status: 'CONFIRMED',
      deliveryAddress,
      phone,
      customerName: customerName || req.user.name,
      notes: notes || '',
    });

    return res.status(201).json({
      order,
      message: 'Order placed successfully! The kitchen has received your order.',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to place order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status value.' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Failed to update order status.' });
  }
};
