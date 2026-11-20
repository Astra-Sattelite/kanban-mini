import { isSameDay } from 'date-fns';
import { Task, TaskType, TASK_TYPES } from '../types';
import { parseDate } from './date';

export const sortByStartDay = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => a.startDay - b.startDay || a.id - b.id);

export const groupByType = (tasks: Task[]): Record<TaskType, Task[]> => {
  const groups = TASK_TYPES.reduce(
    (acc, type) => ({ ...acc, [type]: [] as Task[] }),
    {} as Record<TaskType, Task[]>,
  );
  sortByStartDay(tasks).forEach((task) => groups[task.type].push(task));
  return groups;
};

export const filterTasks = (tasks: Task[], query: string): Task[] => {
  const q = query.trim();
  if (!q) return tasks;

  const date = parseDate(q);
  if (date !== null) {
    return tasks.filter((task) => isSameDay(task.startDay, date) || isSameDay(task.endDay, date));
  }

  const lowered = q.toLowerCase();
  return tasks.filter((task) => task.text.toLowerCase().includes(lowered));
};
