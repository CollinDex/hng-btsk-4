require('dotenv').config();

//Token Generation
const jwt = require('jsonwebtoken');
describe('Token Generation', () => {
  it('should generate a token with correct user details and expiration', () => {
    const user = { userId: '123', email: 'test@example.com' };
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {expiresIn: '1hr'});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded', decoded);
    expect(decoded.userId).toBe(user.userId);
    expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
  });
});

//Test for Organisation Access
const request = require('supertest');
const app = require('../index');
const User = require('../models/user');
const Organisation = require('../models/organisation');