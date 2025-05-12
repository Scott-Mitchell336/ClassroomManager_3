const request = require('supertest');
const app = require('../app');

jest.mock('../db');
const db = require('../db');

describe('/student', () => {
    it('should return list of student', async () => {
        db.query.mockResolvedValueOnce({
            rows: [{ id: 1 }],
        });
        const res = await request(app).get('/api/student');
        expect(res.statusCode).toBe(200);
    });

    it('should create a new student', async () => {
        db.query.mockResolvedValueOnce({
            rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }],
        });
        const res = await request(app).post('/api/student').send({ name: 'John Doe', email: 'john@example.com' });
        expect(res.statusCode).toBe(200);
    })
});
