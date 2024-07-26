const httpMocks = require('node-mocks-http');
const contentController = require('../../controllers/contentController');
const contentService = require('../../services/contentService');

jest.mock('../../services/contentService');

describe('Content Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test('should create content successfully and return 201', async () => {
    const contentData = {
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      categoryId: 'validCategoryId',
      creatorId: 'creatorId',
    };

    req.body = contentData;
    contentService.createContent = jest.fn().mockResolvedValue({ message: 'Content created successfully' });

    await contentController.createContent(req, res, next);

    expect(contentService.createContent).toHaveBeenCalledWith(contentData);
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Content created successfully' });
  });

  test('should return 400 if there is an error during content creation', async () => {
    const contentData = {
      title: 'Sample Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/image.jpg',
      categoryId: 'validCategoryId',
      creatorId: 'creatorId',
    };

    req.body = contentData;
    contentService.createContent = jest.fn().mockRejectedValue(new Error('Invalid category'));

    await contentController.createContent(req, res, next);

    expect(contentService.createContent).toHaveBeenCalledWith(contentData);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Invalid category' });
  });

  test('should get contents successfully and return 200', async () => {
    const query = {
      filters: { type: 'Image' },
      sort: { createdAt: -1 },
      page: 1,
      limit: 10,
    };

    req.query = query;
    const contents = { contents: [], counts: {}, pagination: { totalCount: 0, currentPage: 1, totalPages: 1 } };
    contentService.getContent = jest.fn().mockResolvedValue(contents);

    await contentController.getContents(req, res, next);

    expect(contentService.getContent).toHaveBeenCalledWith(query.filters, query.sort, { page: query.page, limit: query.limit });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(contents);
  });

  test('should return 500 if there is an error during fetching contents', async () => {
    const errorMessage = 'Failed to fetch contents';
    contentService.getContent = jest.fn().mockRejectedValue(new Error(errorMessage));

    await contentController.getContents(req, res, next);

    expect(contentService.getContent).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: errorMessage });
  });

  test('should update content successfully and return 200', async () => {
    const contentData = {
      title: 'Updated Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/updated_image.jpg',
      categoryId: 'validCategoryId',
      creatorId: 'creatorId',
    };

    req.params.id = 'contentId';
    req.body = contentData;
    contentService.updateContent = jest.fn().mockResolvedValue({ message: 'Content updated successfully' });

    await contentController.updateContent(req, res, next);

    expect(contentService.updateContent).toHaveBeenCalledWith('contentId', contentData, 'creatorId');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Content updated successfully' });
  });

  test('should return 400 if there is an error during content update', async () => {
    const contentData = {
      title: 'Updated Content',
      type: 'Image',
      url: null,
      text: null,
      imageUrl: 'http://example.com/updated_image.jpg',
      categoryId: 'validCategoryId',
      creatorId: 'creatorId',
    };

    req.params.id = 'contentId';
    req.body = contentData;
    contentService.updateContent = jest.fn().mockRejectedValue(new Error('Update failed'));

    await contentController.updateContent(req, res, next);

    expect(contentService.updateContent).toHaveBeenCalledWith('contentId', contentData, 'creatorId');
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Update failed' });
  });

  test('should delete content successfully and return 200', async () => {
    req.params.id = 'contentId';
    contentService.deleteContent = jest.fn().mockResolvedValue({ message: 'Content deleted successfully' });

    await contentController.deleteContent(req, res, next);

    expect(contentService.deleteContent).toHaveBeenCalledWith('contentId');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Content deleted successfully' });
  });

  test('should return 400 if there is an error during content deletion', async () => {
    req.params.id = 'contentId';
    contentService.deleteContent = jest.fn().mockRejectedValue(new Error('Deletion failed'));

    await contentController.deleteContent(req, res, next);

    expect(contentService.deleteContent).toHaveBeenCalledWith('contentId');
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Deletion failed' });
  });
});
