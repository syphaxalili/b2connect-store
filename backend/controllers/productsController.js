const Product = require('../models/mongodb/product');

const getAllProducts = async (req, res) => {
  try {
    const { category_id, brand } = req.query;
    const query = {};
    if (category_id) {
      query.category_id = category_id;
    }
    if (brand) {
      query.brand = brand;
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les marques distinctes pour les filtres
const getDistinctBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    const sortedBrands = brands.filter(brand => brand).sort();
    res.status(200).json(sortedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDistinctBrands
};
