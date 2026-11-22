import { z } from 'zod';
import { Task, TASK_TYPES } from '../types';
import initialTasks from '../data/tasks.json';

const STORAGE_KEY = 'kanban.tasks';

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

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

const getBrowserStorage = (): KeyValueStorage | null => {
  try {
    return localStorage;
  } catch {
    return null;
  }
};

const readStored = (storage: KeyValueStorage | null): unknown => {
  if (!storage) return null;

  try {
    const stored = storage.getItem(STORAGE_KEY);
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
};

export const loadTasks = (storage: KeyValueStorage | null = getBrowserStorage()): Task[] => {
  const stored = readStored(storage);

  if (Array.isArray(stored)) {
    const valid = normalizeTasks(stored);

    if (valid.length > 0 || stored.length === 0) return valid;
  }

  return normalizeTasks(initialTasks);
};

export const saveTasks = (tasks: Task[], storage: KeyValueStorage | null = getBrowserStorage()): void => {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Не удалось сохранить задачи в localStorage', error);
  }
};
