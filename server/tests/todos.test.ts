import request from 'supertest';
import app from '../src/app';
import { createUserWithToken } from './helpers';

describe('Todos API', () => {
  let token: string;

  beforeEach(async () => {
    ({ token } = await createUserWithToken());
  });

  function auth(req: request.Test) {
    return req.set('Authorization', `Bearer ${token}`);
  }

  it('GET /api/todos without an Authorization header returns 401', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(401);
  });

  it('GET /api/todos returns an empty list initially', async () => {
    const res = await auth(request(app).get('/api/todos'));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/todos creates a todo', async () => {
    const res = await auth(request(app).post('/api/todos')).send({ title: 'Buy milk', description: '2% please' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Buy milk', description: '2% please', done: false });
    expect(res.body._id).toBeDefined();
  });

  it('POST /api/todos rejects a missing title', async () => {
    const res = await auth(request(app).post('/api/todos')).send({ description: 'no title here' });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/title/i);
  });

  it('PUT /api/todos/:id updates title and description', async () => {
    const created = await auth(request(app).post('/api/todos')).send({ title: 'Original' });
    const id = created.body._id;

    const res = await auth(request(app).put(`/api/todos/${id}`)).send({ title: 'Updated', description: 'New desc' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Updated', description: 'New desc' });
  });

  it('PUT /api/todos/:id with a malformed id returns 400', async () => {
    const res = await auth(request(app).put('/api/todos/not-an-id')).send({ title: 'x' });
    expect(res.status).toBe(400);
  });

  it('PUT /api/todos/:id with a well-formed but nonexistent id returns 404', async () => {
    const res = await auth(request(app).put('/api/todos/64b7f1f1f1f1f1f1f1f1f1f1')).send({ title: 'x' });
    expect(res.status).toBe(404);
  });

  it('PATCH /api/todos/:id/done toggles done status both ways', async () => {
    const created = await auth(request(app).post('/api/todos')).send({ title: 'Toggle me' });
    const id = created.body._id;

    const first = await auth(request(app).patch(`/api/todos/${id}/done`));
    expect(first.status).toBe(200);
    expect(first.body.done).toBe(true);

    const second = await auth(request(app).patch(`/api/todos/${id}/done`));
    expect(second.status).toBe(200);
    expect(second.body.done).toBe(false);
  });

  it('PATCH /api/todos/:id/done with a nonexistent id returns 404', async () => {
    const res = await auth(request(app).patch('/api/todos/64b7f1f1f1f1f1f1f1f1f1f1/done'));
    expect(res.status).toBe(404);
  });

  it('DELETE /api/todos/:id removes the todo', async () => {
    const created = await auth(request(app).post('/api/todos')).send({ title: 'Delete me' });
    const id = created.body._id;

    const del = await auth(request(app).delete(`/api/todos/${id}`));
    expect(del.status).toBe(204);

    const list = await auth(request(app).get('/api/todos'));
    expect(list.body.find((t: { _id: string }) => t._id === id)).toBeUndefined();
  });

  it('DELETE /api/todos/:id with a nonexistent id returns 404', async () => {
    const res = await auth(request(app).delete('/api/todos/64b7f1f1f1f1f1f1f1f1f1f1'));
    expect(res.status).toBe(404);
  });
});
