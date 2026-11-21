import { formatDate, parseDate } from './date';
import { isTaskOverdue } from './overdue';
import { filterTasks } from './tasks';
import { Task } from '../types';

const DAY = 24 * 60 * 60 * 1000;

const INSTANT = Date.UTC(2025, 11, 31, 18, 40);

describe('согласованность дат (в часовом поясе машины)', () => {
  it.each(['31.12.2025', '01.01.2026', '29.02.2028', '09.03.2025', '02.11.2025'])(
    'parseDate и formatDate обратимы для %s (в т.ч. дни перевода часов)',
    (value) => {
      expect(formatDate(parseDate(value)!)).toBe(value);
    },
  );

  it('дедлайн сегодня не просрочен, вчера — просрочен', () => {
    const now = new Date(2025, 0, 20, 12).getTime();
    expect(isTaskOverdue({ type: 'todo', endDay: parseDate('20.01.2025')! }, now)).toBe(false);
    expect(isTaskOverdue({ type: 'todo', endDay: parseDate('19.01.2025')! }, now)).toBe(true);
  });

  it('дата, показанная на карточке, находится поиском, а чужая нет', () => {
    const task: Task = { id: 1, type: 'todo', startDay: INSTANT, endDay: INSTANT, text: 'x' };
    const shown = formatDate(INSTANT);
    const other = formatDate(INSTANT + 2 * DAY);

    expect(filterTasks([task], shown)).toHaveLength(1);
    expect(filterTasks([task], other)).toHaveLength(0);
  });
});