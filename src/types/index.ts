export const TASK_TYPES = ['todo', 'in_progress', 'review', 'done'] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export interface Task {
  id: number;
  type: TaskType;
  startDay: number;
  endDay: number;
  text: string;
}
