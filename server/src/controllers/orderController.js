import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getIsConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc    Create new order with server-verified prices & stock check
// @route   POST /api/orders
// @access  Private (User/Admin)
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide full shipping details (name, address, city, phone)' });
    }

    if (getIsConnected()) {
      // 1. Validate items and compute totals strictly from trusted DB product records
      const verifiedItems = [];
      let itemsPrice = 0;

      for (const item of orderItems) {
        const productId = item.product || item._id;
        const quantity = Number(item.quantity);

        if (!quantity || quantity < 1) {
          return res.status(400).json({ message: `Invalid quantity for item ${productId}` });
        }

        const dbProduct = await Product.findById(productId);
        if (!dbProduct) {
          return res.status(404).json({ message: `Product not found with id: ${productId}` });
        }

        if (dbProduct.stock < quantity) {
          return res.status(400).json({
            message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} left in stock.`
          });
        }

        // Deduct inventory stock
        dbProduct.stock -= quantity;
        await dbProduct.save();

        const verifiedPrice = Number(dbProduct.price);
        itemsPrice += verifiedPrice * quantity;

        verifiedItems.push({
          product: dbProduct._id,
          name: dbProduct.name,
          quantity,
          price: verifiedPrice,
          imageUrl: dbProduct.imageUrl
        });
      }

      itemsPrice = Number(itemsPrice.toFixed(2));
      const taxPrice = Number((itemsPrice * 0.05).toFixed(2)); // 5% estimated tax
      const shippingPrice = itemsPrice >= 35 ? 0.00 : 4.99; // Free shipping over $35
      const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

      const order = await Order.create({
        user: req.user._id,
        orderItems: verifiedItems,
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          postalCode: (shippingAddress.postalCode || '10001').trim(),
          country: (shippingAddress.country || 'India').trim(),
          phone: shippingAddress.phone.trim()
        },
        paymentMethod: paymentMethod || 'Cash On Delivery',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: paymentMethod === 'Direct Demo Payment',
        paidAt: paymentMethod === 'Direct Demo Payment' ? new Date() : null,
        status: 'Pending',
        statusHistory: [
          {
            status: 'Pending',
            changedAt: new Date(),
            note: 'Order successfully placed. Verification pending.'
          }
        ]
      });

      return res.status(201).json(order);
    } else {
      // In-memory fallback
      const verifiedItems = [];
      let itemsPrice = 0;

      for (const item of orderItems) {
        const productId = item.product || item._id;
        const quantity = Number(item.quantity);

        if (!quantity || quantity < 1) {
          return res.status(400).json({ message: `Invalid quantity for item ${productId}` });
        }

        const memProduct = memoryStore.products.find(p => p._id === productId);
        if (!memProduct) {
          return res.status(404).json({ message: `Product not found with id: ${productId}` });
        }

        if (memProduct.stock < quantity) {
          return res.status(400).json({
            message: `Insufficient stock for "${memProduct.name}". Only ${memProduct.stock} left in stock.`
          });
        }

        // Deduct memory stock
        memProduct.stock -= quantity;

        const verifiedPrice = Number(memProduct.price);
        itemsPrice += verifiedPrice * quantity;

        verifiedItems.push({
          product: memProduct._id,
          name: memProduct.name,
          quantity,
          price: verifiedPrice,
          imageUrl: memProduct.imageUrl
        });
      }

      itemsPrice = Number(itemsPrice.toFixed(2));
      const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
      const shippingPrice = itemsPrice >= 35 ? 0.00 : 4.99;
      const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

      const newOrder = {
        _id: `ord_${Date.now()}`,
        user: req.user._id,
        orderItems: verifiedItems,
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          postalCode: (shippingAddress.postalCode || '10001').trim(),
          country: (shippingAddress.country || 'India').trim(),
          phone: shippingAddress.phone.trim()
        },
        paymentMethod: paymentMethod || 'Cash On Delivery',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: paymentMethod === 'Direct Demo Payment',
        paidAt: paymentMethod === 'Direct Demo Payment' ? new Date().toISOString() : null,
        status: 'Pending',
        statusHistory: [
          {
            status: 'Pending',
            changedAt: new Date().toISOString(),
            note: 'Order successfully placed. Verification pending.'
          }
        ],
        createdAt: new Date().toISOString()
      };

      memoryStore.orders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = memoryStore.orders
        .filter(o => o.user.toString() === req.user._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(orders);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (with ownership check: owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order;
    if (getIsConnected()) {
      order = await Order.findById(id).populate('user', 'name email');
    } else {
      order = memoryStore.orders.find(o => o._id === id);
      if (order) {
        const u = memoryStore.users.find(usr => usr._id === order.user);
        order = {
          ...order,
          user: u ? { _id: u._id, name: u.name, email: u.email } : { _id: order.user }
        };
      }
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderUserId = typeof order.user === 'object' ? order.user._id.toString() : order.user.toString();

    // Prevent IDOR: Only order owner or admin can view order
    if (orderUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to view this order' });
    }

    return res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const enrichedOrders = memoryStore.orders.map(o => {
        const u = memoryStore.users.find(usr => usr._id === o.user);
        return {
          ...o,
          user: u ? { _id: u._id, name: u.name, email: u.email } : { _id: o.user }
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(enrichedOrders);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (getIsConnected()) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      }

      order.statusHistory.push({
        status,
        changedAt: new Date(),
        note: note || `Order marked as ${status} by admin`
      });

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      const orderIndex = memoryStore.orders.findIndex(o => o._id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const order = memoryStore.orders[orderIndex];
      order.status = status;
      if (status === 'Delivered') {
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date().toISOString();
      }

      if (!order.statusHistory) order.statusHistory = [];
      order.statusHistory.push({
        status,
        changedAt: new Date().toISOString(),
        note: note || `Order marked as ${status} by admin`
      });

      memoryStore.orders[orderIndex] = order;
      return res.json(order);
    }
  } catch (error) {
    next(error);
  }
};
