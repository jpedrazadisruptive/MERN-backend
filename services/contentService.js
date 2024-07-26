const Content = require('../models/contentModel');
const Category = require('../models/categoryModel');
const { validateContentType } = require('../utils/validators');

exports.createContent = async (contentData) => {
  const { title, type, url, text, imageUrl, categoryId, creatorId } = contentData;

  validateContentType(type);

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Invalid category');
  }

  if (type === 'Video' && !url) {
    throw new Error('URL is required for videos');
  } else if (type === 'Text' && !text) {
    throw new Error('Text is required for text content');
  } else if (type === 'Image' && !imageUrl) {
    throw new Error('Image URL is required for images');
  }

  const content = new Content({
    title,
    type,
    url: type === 'Video' ? url : null,
    text: type === 'Text' ? text : null,
    imageUrl: type === 'Image' ? imageUrl : null,
    category: categoryId,
    creator: creatorId,
  });

  await content.save();

  return { message: 'Content created successfully' };
};

exports.updateContent = async (contentId, contentData, userId) => {
  const { title, type, url, text, imageUrl, categoryId } = contentData;

  const content = await Content.findById(contentId);
  if (!content) {
    throw new Error('Content not found');
  }
  console.log(content.creator.toString())
  console.log(userId)
  if (content.creator.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  validateContentType(type);

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Invalid category');
  }

  if (type === 'Video' && !url) {
    throw new Error('URL is required for videos');
  } else if (type === 'Text' && !text) {
    throw new Error('Text is required for text content');
  } else if (type === 'Image' && !imageUrl) {
    throw new Error('Image URL is required for images');
  }

  content.title = title;
  content.type = type;
  content.url = type === 'Video' ? url : null;
  content.text = type === 'Text' ? text : null;
  content.imageUrl = type === 'Image' ? imageUrl : null;
  content.category = categoryId;

  await content.save();

  return { message: 'Content updated successfully' };
};

exports.getContent = async (filters = {}, sort = {}, pagination = { page: 1, limit: 10 }) => {
  const { page, limit } = pagination;

  const query = {};
  if (filters.categoryId) {
    query.category = filters.categoryId;
  }
  if (filters.creatorId) {
    query.creator = filters.creatorId;
  }
  if (filters.type) {
    query.type = filters.type;
  }

  const totalCount = await Content.countDocuments(query);

  const contents = await Content.find(query)
    .populate('category', 'name')
    .populate('creator', 'username')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const typeCounts = await Content.aggregate([
    { $match: query },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);

  const counts = typeCounts.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});

  return {
    contents,
    counts,
    pagination: {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

exports.deleteContent = async (contentId) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new Error('Content not found');
  }
  await Content.deleteOne({ _id: contentId });
  return { message: 'Content deleted successfully' };
};
