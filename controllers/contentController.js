const contentService = require('../services/contentService');

exports.createContent = async (req, res) => {
  try {
    const result = await contentService.createContent(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getContents = async (req, res) => {
  try {
    const filters = req.query.filters || {};
    const sort = req.query.sort || {};
    const pagination = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const result = await contentService.getContent(filters, sort, pagination);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.creatorId;
    const result = await contentService.updateContent(id, req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const result = await contentService.deleteContent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
