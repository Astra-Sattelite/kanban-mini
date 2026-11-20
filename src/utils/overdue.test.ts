import { isTaskOverdue } from './overdue';
import { TaskType } from '../types';

const NOW = new Date(2025, 0, 20, 12, 0, 0).getTime();
const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min).getTime();

describe('isTaskOverdue', () => {
  it('возвращает true, если дедлайн раньше сегодняшней даты', () => {
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 19) }, NOW)).toBe(true);
    expect(isTaskOverdue({ type: 'in_progress', endDay: at(2024, 12, 31) }, NOW)).toBe(true);
    expect(isTaskOverdue({ type: 'review', endDay: at(2020, 5, 5) }, NOW)).toBe(true);
  });

  it('возвращает true для дедлайна вчера в 23:59', () => {
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 19, 23, 59) }, NOW)).toBe(true);
  });

  it('возвращает false, если дедлайн сегодня (в любое время суток)', () => {
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 20, 0, 0) }, NOW)).toBe(false);
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 20, 9, 0) }, NOW)).toBe(false);
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 20, 23, 59) }, NOW)).toBe(false);
  });

  it('возвращает false, если дедлайн в будущем', () => {
    expect(isTaskOverdue({ type: 'todo', endDay: at(2025, 1, 21) }, NOW)).toBe(false);
    expect(isTaskOverdue({ type: 'in_progress', endDay: at(2030, 1, 1) }, NOW)).toBe(false);
  });

  it('никогда не считает просроченной задачу в статусе done', () => {
    expect(isTaskOverdue({ type: 'done', endDay: at(2020, 1, 1) }, NOW)).toBe(false);
    expect(isTaskOverdue({ type: 'done', endDay: at(2025, 1, 19) }, NOW)).toBe(false);
  });

  it.each<TaskType>(['todo', 'in_progress', 'review'])('учитывает просрочку в статусе %s', (type) => {
    expect(isTaskOverdue({ type, endDay: at(2025, 1, 1) }, NOW)).toBe(true);
  });

  it('по умолчанию использует текущую дату', () => {
    const day = 24 * 60 * 60 * 1000;
    expect(isTaskOverdue({ type: 'todo', endDay: Date.now() - 3 * day })).toBe(true);
    expect(isTaskOverdue({ type: 'todo', endDay: Date.now() + 3 * day })).toBe(false);
  });
});
