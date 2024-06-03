import { expect } from 'chai';
import request from 'supertest';
import app from '../../app.js';

describe('POST /api/friends/send', () => {
    it('should send a friend request', async () => {
        // Replace 'yourToken' with a valid token
        const token = 'yourToken';

        const res = await request(app)
            .post('/api/friends/send')
            .set('Authorization', `Bearer ${token}`)
            .send({ senderId: '658a6102155c91ffcc7b38b5', receiverId: '658a94dc5b080394f66b8eb2' });

        expect(res.status).to.equal(201);
        expect(res.body).to.include({ message: 'Friend request sent' });
    });
});
