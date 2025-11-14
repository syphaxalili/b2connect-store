const Category = require("../models/mongodb/category");
const Product = require("../models/mongodb/product");

const getAllCategories = async (req, res) => {
  try {
    const { 
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1, 
      limit = 20 
    } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [];

    // Recherche
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Joindre les produits
    pipeline.push({
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category_id',
        as: 'products'
      }
    });

    // Projeter les champs
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        specifications: 1,
        created_at: 1,
        product_count: { $size: '$products' },
        specs: 1
      }
    });

    // Tri dynamique
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: sortOptions });

    // Compter le total avant pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Category.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    const categoriesWithCount = await Category.aggregate(pipeline);

    res.status(200).json({
      categories: categoriesWithCount,
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

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    const productCount = await Product.countDocuments({
      category_id: category._id,
    });

    const categoryWithCount = {
      ...category.toObject(),
      product_count: productCount,
    };

    res.status(200).json(categoryWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }
    res.status(200).json({ message: "Catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoriesForFilters = async (req, res) => {
  try {
    const categories = await Category.find().select("_id name").lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesForFilters,
};
