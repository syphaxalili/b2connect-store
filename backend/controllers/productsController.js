const Product = require('../models/mongodb/product');

const getAllProducts = async (req, res) => {
  try {
    const { 
      category_id, 
      brand, 
      price,
      sort,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    if (category_id) query.category_id = category_id;
    if (brand) query.brand = brand;
    
    if (price) {
      if (price === "500+") {
        query.price = { $gte: 500 };
      } else {
        const [min, max] = price.split("-").map(Number);
        if (min && max) {
          query.price = { $gte: min, $lte: max };
        }
      }
    }

    let sortOptions = { created_at: -1 }; 
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 };
    }
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const products = await Product.find(query)
      .select('name brand price images category_id stock created_at')
      .lean()
      .limit(limitNum)
      .skip(skip)
      .sort(sortOptions);
    
    const total = await Product.countDocuments(query); 
    
    res.status(200).json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
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
