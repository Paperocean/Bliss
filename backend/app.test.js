const request = require('supertest');
const app = require('./app');

describe('GET /api/health', () => {
    it('should respond with status 200 and status OK', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'OK' });
    });
});