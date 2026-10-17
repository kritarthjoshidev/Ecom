import Product from '../models/Product.js';
import { getIsConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc    Get all products with search, category filtering & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, minPrice, maxPrice } = req.query;

    if (getIsConnected()) {
      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      else if (sort === 'price-desc') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'name-asc') sortOptions = { name: 1 };

      const products = await Product.find(query).sort(sortOptions);
      const total = products.length;

      // Distinct categories
      const categories = await Product.distinct('category');

      return res.json({
        products,
        total,
        categories: ['All', ...categories]
      });
    } else {
      let filtered = [...memoryStore.products];

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (minPrice) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }

      if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const distinctCategories = Array.from(new Set(memoryStore.products.map(p => p.category)));

      return res.json({
        products: filtered,
        total: filtered.length,
        categories: ['All', ...distinctCategories]
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } else {
      const product = memoryStore.products.find(p => p._id === id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, imageUrl, featured } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined || !imageUrl) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, description, price, category, stock, imageUrl'
      });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock cannot be negative numbers' });
    }

    if (getIsConnected()) {
      const product = await Product.create({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
        imageUrl: imageUrl.trim(),
        featured: !!featured,
        rating: 4.5,
        numReviews: 0
      });

      return res.status(201).json(product);
    } else {
      const newProduct = {
        _id: `prod_${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
        imageUrl: imageUrl.trim(),
        featured: !!featured,
        rating: 4.5,
        numReviews: 0,
        createdAt: new Date().toISOString()
      };

      memoryStore.products.unshift(newProduct);
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, imageUrl, featured } = req.body;

    if (getIsConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (name !== undefined) product.name = name.trim();
      if (description !== undefined) product.description = description.trim();
      if (price !== undefined) product.price = Number(price);
      if (category !== undefined) product.category = category.trim();
      if (stock !== undefined) product.stock = Number(stock);
      if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
      if (featured !== undefined) product.featured = !!featured;

      const updated = await product.save();
      return res.json(updated);
    } else {
      const index = memoryStore.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const existing = memoryStore.products[index];
      const updated = {
        ...existing,
        name: name !== undefined ? name.trim() : existing.name,
        description: description !== undefined ? description.trim() : existing.description,
        price: price !== undefined ? Number(price) : existing.price,
        category: category !== undefined ? category.trim() : existing.category,
        stock: stock !== undefined ? Number(stock) : existing.stock,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
        featured: featured !== undefined ? !!featured : existing.featured,
        updatedAt: new Date().toISOString()
      };

      memoryStore.products[index] = updated;
      return res.json(updated);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await Product.findByIdAndDelete(id);
      return res.json({ message: 'Product successfully removed' });
    } else {
      const index = memoryStore.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      memoryStore.products.splice(index, 1);
      return res.json({ message: 'Product successfully removed' });
    }
  } catch (error) {
    next(error);
  }
};
