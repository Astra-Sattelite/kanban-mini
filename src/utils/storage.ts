import { z } from 'zod';
import { Task, TASK_TYPES } from '../types';
import initialTasks from '../data/tasks.json';

const STORAGE_KEY = 'kanban.tasks';

const taskSchema = z.object({
  id: z.number(),
  type: z.enum(TASK_TYPES),
  startDay: z.number(),
  endDay: z.number(),
  text: z.string(),
});

export const normalizeTasks = (raw: unknown): Task[] => {
  const items = z.array(z.unknown()).safeParse(raw);
  if (!items.success) return [];

  return items.data.flatMap((item) => {
    const task = taskSchema.safeParse(item);
    return task.success ? [task.data] : [];
  });
};

const readStored = (): unknown => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
};

export const loadTasks = (): Task[] => {
  const stored = readStored();
  return normalizeTasks(Array.isArray(stored) ? stored : initialTasks);
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};
