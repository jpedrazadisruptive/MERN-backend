const Category = require('../../models/categoryModel');
const categoryService = require('../../services/categoryService');

jest.mock('../../models/categoryModel');

describe('Category Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const categoryData = {
        name: 'TestCategory',
        allowsImages: true,
        allowsVideos: false,
        allowsTexts: true,
      };

      Category.findOne.mockResolvedValue(null);
      Category.prototype.save = jest.fn().mockResolvedValue();

      const result = await categoryService.createCategory(categoryData);

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'TestCategory' });
      expect(Category.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Category created successfully' });
    });

    it('should throw an error if category already exists', async () => {
      const categoryData = {
        name: 'TestCategory',
        allowsImages: true,
        allowsVideos: false,
        allowsTexts: true,
      };

      Category.findOne.mockResolvedValue(categoryData);

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('Category already exists');

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'TestCategory' });
      expect(Category.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const categories = [
        { name: 'Category1', allowsImages: true, allowsVideos: false, allowsTexts: true },
        { name: 'Category2', allowsImages: false, allowsVideos: true, allowsTexts: false },
      ];

      Category.find.mockResolvedValue(categories);

      const result = await categoryService.getAllCategories();

      expect(Category.find).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });
});
