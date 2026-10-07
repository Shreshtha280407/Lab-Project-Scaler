import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    if (category && category !== 'All Categories' && category !== '') {
      query.category = category;
    }

    let sortQuery = {};
    if (sort === 'price_asc') {
      sortQuery.price = 1;
    } else if (sort === 'price_desc') {
      sortQuery.price = -1;
    } else {
      sortQuery.createdAt = -1; // Default descending creation date
    }

    const products = await Product.find(query).sort(sortQuery);

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
