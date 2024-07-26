const request = require('supertest');
const express = require('express');
const categoryController = require('../../controllers/categoryController');
const categoryService = require('../../services/categoryService');

jest.mock('../../services/categoryService');

describe('Category Controller', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/categories', categoryController.createCategory);
    app.get('/categories', categoryController.getAllCategories);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a category and return 201 if valid data is provided', async () => {
    const categoryData = {
      name: 'TestCategory',
      allowsImages: true,
      allowsVideos: false,
      allowsTexts: true,
    };

    categoryService.createCategory.mockResolvedValue({ message: 'Category created successfully' });

    const response = await request(app)
      .post('/categories')
      .send(categoryData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Category created successfully' });
    expect(categoryService.createCategory).toHaveBeenCalledWith(categoryData);
  });

  test('should return 400 if an error occurs during category creation', async () => {
    const categoryData = {
      name: 'TestCategory',
      allowsImages: true,
      allowsVideos: false,
      allowsTexts: true,
    };

    const errorMessage = 'Category already exists';
    categoryService.createCategory.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .post('/categories')
      .send(categoryData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: errorMessage });
    expect(categoryService.createCategory).toHaveBeenCalledWith(categoryData);
  });

  test('should return all categories with status 200', async () => {
    const categories = [
      { _id: '1', name: 'Category1', allowsImages: true, allowsVideos: true, allowsTexts: true },
      { _id: '2', name: 'Category2', allowsImages: false, allowsVideos: true, allowsTexts: true },
    ];

    categoryService.getAllCategories.mockResolvedValue(categories);

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(categories);
    expect(categoryService.getAllCategories).toHaveBeenCalled();
  });

  test('should return 500 if an error occurs during fetching categories', async () => {
    const errorMessage = 'Failed to fetch categories';
    categoryService.getAllCategories.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/categories');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
    expect(categoryService.getAllCategories).toHaveBeenCalled();
  });
});
