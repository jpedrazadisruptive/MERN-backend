const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const authService = require('../../services/authService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
        role: 'Admin',
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue();

      const result = await authService.register(userData);

      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ username: 'testUser' }, { email: 'test@example.com' }] });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw an error if username or email already exists', async () => {
      const userData = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
        role: 'Admin',
      };

      User.findOne.mockResolvedValue(userData);

      await expect(authService.register(userData)).rejects.toThrow('Username or email already exists');

      expect(User.findOne).toHaveBeenCalledWith({ $or: [{ username: 'testUser' }, { email: 'test@example.com' }] });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(User.prototype.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Admin',
      };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await authService.login(userData);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 'userId', role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(result).toEqual({ token: 'token', role: 'Admin' });
    });

    it('should throw an error if email is invalid', async () => {
      const userData = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);

      await expect(authService.login(userData)).rejects.toThrow('Invalid email or password');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'invalid@example.com' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if password is invalid', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };

      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'Admin',
      };

      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(userData)).rejects.toThrow('Invalid email or password');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('invalidPassword', 'hashedPassword');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
