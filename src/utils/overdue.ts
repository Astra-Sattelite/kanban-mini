import { isBefore, startOfDay } from 'date-fns';
import { Task } from '../types';

export const isTaskOverdue = (task: Pick<Task, 'type' | 'endDay'>, now: number = Date.now()): boolean =>
  task.type !== 'done' && isBefore(task.endDay, startOfDay(now));
