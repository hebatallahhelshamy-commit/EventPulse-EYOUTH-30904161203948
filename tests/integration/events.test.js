const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/events', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'You must be logged in' });
  }
  res.status(201).json({ status: 'success' });
});

describe('Events Integration Tests', () => {
  it('GET /api/events - should block unauthorized create', async () => {
    const res = await request(app).post('/api/events').send({});
    expect(res.statusCode).toBe(401);
  });
});