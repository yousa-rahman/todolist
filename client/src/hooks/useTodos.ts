import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '../api/todos';
import { useAuth } from '../context/AuthContext';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

function todosKey(userId: string | undefined) {
  return ['todos', userId] as const;
}

export function useTodos() {
  const { user } = useAuth();
  return useQuery({
    queryKey: todosKey(user?.id),
    queryFn: api.getTodos,
    enabled: !!user?.id,
  });
}

function useOptimisticTodosMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  updater: (previous: Todo[], variables: TVariables) => Todo[]
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const key = todosKey(user?.id);

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previousTodos = queryClient.getQueryData<Todo[]>(key);
      queryClient.setQueryData<Todo[]>(key, (old) => updater(old ?? [], variables));
      return { previousTodos };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(key, context.previousTodos);
      }
      toast.error(error.message || 'Something went wrong. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useCreateTodo() {
  return useOptimisticTodosMutation<CreateTodoInput>(api.createTodo, (previous, input) => [
    {
      _id: `temp-${Date.now()}`,
      title: input.title,
      description: input.description ?? '',
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    ...previous,
  ]);
}

export function useUpdateTodo() {
  return useOptimisticTodosMutation<{ id: string; input: UpdateTodoInput }>(
    ({ id, input }) => api.updateTodo(id, input),
    (previous, { id, input }) =>
      previous.map((todo) => (todo._id === id ? { ...todo, ...input } : todo))
  );
}

export function useToggleTodo() {
  return useOptimisticTodosMutation<string>(api.toggleTodoDone, (previous, id) =>
    previous.map((todo) => (todo._id === id ? { ...todo, done: !todo.done } : todo))
  );
}

export function useDeleteTodo() {
  return useOptimisticTodosMutation<string>(api.deleteTodo, (previous, id) =>
    previous.filter((todo) => todo._id !== id)
  );
}
