import request from 'supertest';
import app from '../src/app';
import { createUserWithToken } from './helpers';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('creates a user and returns a token with no passwordHash leaked', async () => {
      const res = await request(app).post('/api/auth/register').send({ username: 'alice', password: 'password123' });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toMatchObject({ username: 'alice' });
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(JSON.stringify(res.body)).not.toMatch(/passwordHash/i);
    });

    it('rejects a duplicate username', async () => {
      await request(app).post('/api/auth/register').send({ username: 'bob', password: 'password123' });
      const res = await request(app).post('/api/auth/register').send({ username: 'bob', password: 'password456' });
      expect(res.status).toBe(400);
    });

    it('rejects a missing username', async () => {
      const res = await request(app).post('/api/auth/register').send({ password: 'password123' });
      expect(res.status).toBe(400);
    });

    it('rejects a password shorter than 8 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({ username: 'shortpw', password: 'abc123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with correct credentials', async () => {
      await request(app).post('/api/auth/register').send({ username: 'carol', password: 'password123' });
      const res = await request(app).post('/api/auth/login').send({ username: 'carol', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toMatchObject({ username: 'carol' });
    });

    it('rejects a wrong password and an unknown username with the same message', async () => {
      await request(app).post('/api/auth/register').send({ username: 'dave', password: 'password123' });

      const wrongPassword = await request(app).post('/api/auth/login').send({ username: 'dave', password: 'wrongpass' });
      const unknownUser = await request(app).post('/api/auth/login').send({ username: 'nosuchuser', password: 'whatever' });

      expect(wrongPassword.status).toBe(401);
      expect(unknownUser.status).toBe(401);
      expect(wrongPassword.body.error.message).toBe(unknownUser.body.error.message);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the current user for a valid token', async () => {
      const { token, user } = await createUserWithToken('erin');
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ username: user.username, id: String(user._id) });
    });

    it('returns 401 with no token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 401 with a garbage token', async () => {
      const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');
      expect(res.status).toBe(401);
    });
  });

  describe('cross-user isolation', () => {
    it('prevents user B from reading, updating, toggling, or deleting user A\'s todo', async () => {
      const userA = await createUserWithToken('frank');
      const userB = await createUserWithToken('grace');

      const created = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${userA.token}`)
        .send({ title: "Frank's secret todo" });
      const todoId = created.body._id;

      const listAsB = await request(app).get('/api/todos').set('Authorization', `Bearer ${userB.token}`);
      expect(listAsB.body).toEqual([]);

      const getNotApplicable = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userB.token}`)
        .send({ title: 'Hijacked' });
      expect(getNotApplicable.status).toBe(404);

      const toggleAsB = await request(app)
        .patch(`/api/todos/${todoId}/done`)
        .set('Authorization', `Bearer ${userB.token}`);
      expect(toggleAsB.status).toBe(404);

      const deleteAsB = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${userB.token}`);
      expect(deleteAsB.status).toBe(404);

      const verifyUntouched = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${userA.token}`);
      expect(verifyUntouched.body).toHaveLength(1);
      expect(verifyUntouched.body[0]).toMatchObject({ _id: todoId, title: "Frank's secret todo", done: false });
    });
  });
});
