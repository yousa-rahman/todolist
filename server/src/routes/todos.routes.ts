import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  toggleTodoDone,
  updateTodo,
} from '../controllers/todos.controller';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import { createTodoValidators, idParamValidator, updateTodoValidators } from '../validators/todo.validators';

const router = Router();

router.use(requireAuth);

router.get('/', getAllTodos);
router.post('/', createTodoValidators, validate, createTodo);
router.put('/:id', updateTodoValidators, validate, updateTodo);
router.patch('/:id/done', idParamValidator, validate, toggleTodoDone);
router.delete('/:id', idParamValidator, validate, deleteTodo);

export default router;
