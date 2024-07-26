const Category = require('../models/categoryModel');

exports.createCategory = async (categoryData) => {
  const { name, allowsImages, allowsVideos, allowsTexts } = categoryData;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new Error('Category already exists');
  }

  const category = new Category({ name, allowsImages, allowsVideos, allowsTexts });
  await category.save();

  return { message: 'Category created successfully' };
};

exports.getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};
