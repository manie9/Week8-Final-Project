const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const app = require('../server'); // Assuming server.js exports the app or server

// Mock environment variables
process.env.ACCESS_TOKEN_SECRET = 'testsecret';

describe('API Endpoints', () => {
  let token;

  beforeAll(() => {
    // Generate a test token
    token = jwt.sign({ username: 'testuser' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  });

  test('POST /api/login returns access token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('GET /api/test without token should fail', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toEqual(401);
  });

  test('GET /api/test with token should succeed', async () => {
    const res = await request(app)
      .get('/api/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/feedback with token should save feedback', async () => {
    const feedback = {
      rating: 5,
      category: 'app',
      feedback: 'Great app!',
      email: 'test@example.com',
      submittedAt: new Date().toISOString(),
    };
    const res = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send(feedback);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Feedback saved successfully');
  });

  test('GET /api/feedback with token should return feedbacks', async () => {
    const res = await request(app)
      .get('/api/feedback')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
