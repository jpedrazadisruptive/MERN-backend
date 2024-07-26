const request = require('supertest');
const express = require('express');
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Controller', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post('/register', authController.register);
    app.post('/login', authController.login);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    test('should register a user and return 201 if valid data is provided', async () => {
      const userData = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
        role: 'Admin',
      };

      authService.register.mockResolvedValue({ message: 'User registered successfully' });

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully' });
      expect(authService.register).toHaveBeenCalledWith(userData);
    });

    test('should return 400 if an error occurs during registration', async () => {
      const userData = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
        role: 'Admin',
      };

      const errorMessage = 'Username or email already exists';
      authService.register.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(authService.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('Login', () => {
    test('should login a user and return 200 with a token if valid data is provided', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const token = 'mockedToken';
      authService.login.mockResolvedValue({ token });

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token });
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });

    test('should return 400 if an error occurs during login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const errorMessage = 'Invalid email or password';
      authService.login.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });
  });
});
