import type { Request, Response } from 'express';
import { TodoModel } from '../models/Todo';
import { ApiError } from '../utils/ApiError';

export async function getAllTodos(req: Request, res: Response) {
  const todos = await TodoModel.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  res.json(todos);
}

export async function createTodo(req: Request, res: Response) {
  const { title, description } = req.body;
  const todo = await TodoModel.create({ title, description, userId: req.user!.id });
  res.status(201).json(todo);
}

export async function updateTodo(req: Request, res: Response) {
  const { title, description } = req.body;
  const todo = await TodoModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    { title, description },
    { new: true, runValidators: true }
  );
  if (!todo) {
    throw ApiError.notFound('Todo not found');
  }
  res.json(todo);
}

export async function toggleTodoDone(req: Request, res: Response) {
  const todo = await TodoModel.findOne({ _id: req.params.id, userId: req.user!.id });
  if (!todo) {
    throw ApiError.notFound('Todo not found');
  }
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
}

export async function deleteTodo(req: Request, res: Response) {
  const todo = await TodoModel.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  if (!todo) {
    throw ApiError.notFound('Todo not found');
  }
  res.status(204).send();
}
