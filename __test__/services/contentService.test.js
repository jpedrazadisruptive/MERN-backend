const contentService = require('../../services/contentService');
const Content = require('../../models/contentModel');
const Category = require('../../models/categoryModel');

jest.mock('../../models/contentModel');
jest.mock('../../models/categoryModel');

describe('Content Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should create content successfully with valid data', async () => {
    const contentData = {
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      categoryId: 'validCategoryId',
      creatorId: 'creatorId',
    };

    Category.findById = jest.fn().mockResolvedValue({ _id: 'validCategoryId' });
    Content.prototype.save = jest.fn().mockResolvedValue(contentData);

    const result = await contentService.createContent(contentData);

    expect(Category.findById).toHaveBeenCalledWith('validCategoryId');
    expect(Content.prototype.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Content created successfully' });
  });

  test('should throw error for invalid category', async () => {
    const contentData = {
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      categoryId: 'invalidCategoryId',
      creatorId: 'creatorId',
    };

    Category.findById = jest.fn().mockResolvedValue(null);

    await expect(contentService.createContent(contentData)).rejects.toThrow('Invalid category');
  });

  test('should update content successfully with valid data', async () => {
    const contentId = 'contentId';
    const userId = 'creatorId';
    const contentData = {
      title: 'Updated Content',
      type: 'Video',
      url: 'http://example.com/video.mp4',
      text: null,
      imageUrl: null,
      categoryId: 'validCategoryId',
    };

    const existingContent = {
      _id: contentId,
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      category: 'validCategoryId',
      creator: 'creatorId',
      save: jest.fn().mockResolvedValue(),
    };

    Content.findById = jest.fn().mockResolvedValue(existingContent);
    Category.findById = jest.fn().mockResolvedValue({ _id: 'validCategoryId' });

    const result = await contentService.updateContent(contentId, contentData, userId);

    expect(Content.findById).toHaveBeenCalledWith(contentId);
    expect(Category.findById).toHaveBeenCalledWith('validCategoryId');
    expect(existingContent.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Content updated successfully' });
  });

  test('should throw error if content to update is not found', async () => {
    const contentId = 'invalidContentId';
    const userId = 'creatorId';
    const contentData = {
      title: 'Updated Content',
      type: 'Video',
      url: 'http://example.com/video.mp4',
      text: null,
      imageUrl: null,
      categoryId: 'validCategoryId',
    };

    Content.findById = jest.fn().mockResolvedValue(null);

    await expect(contentService.updateContent(contentId, contentData, userId)).rejects.toThrow('Content not found');
  });

  test('should throw error if user is not the creator of the content', async () => {
    const contentId = 'contentId';
    const userId = 'otherUserId';
    const contentData = {
      title: 'Updated Content',
      type: 'Video',
      url: 'http://example.com/video.mp4',
      text: null,
      imageUrl: null,
      categoryId: 'validCategoryId',
    };

    const existingContent = {
      _id: contentId,
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      category: 'validCategoryId',
      creator: 'creatorId',
    };

    Content.findById = jest.fn().mockResolvedValue(existingContent);

    await expect(contentService.updateContent(contentId, contentData, userId)).rejects.toThrow('Unauthorized');
  });

  test('should delete content successfully if content exists', async () => {
    const contentId = 'contentId';

    const existingContent = {
      _id: contentId,
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      category: 'validCategoryId',
      creator: 'creatorId',
    };

    Content.findById = jest.fn().mockResolvedValue(existingContent);
    Content.deleteOne = jest.fn().mockResolvedValue({});

    const result = await contentService.deleteContent(contentId);

    expect(Content.findById).toHaveBeenCalledWith(contentId);
    expect(Content.deleteOne).toHaveBeenCalledWith({ _id: contentId });
    expect(result).toEqual({ message: 'Content deleted successfully' });
  });

  test('should throw error if content to delete is not found', async () => {
    const contentId = 'invalidContentId';

    Content.findById = jest.fn().mockResolvedValue(null);

    await expect(contentService.deleteContent(contentId)).rejects.toThrow('Content not found');
  });
});
