import { filterTasks, groupByType } from './tasks';
import { formatDate, parseDate, maskDateInput } from './date';
import { Task } from '../types';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day, 12).getTime();

const tasks: Task[] = [
  { id: 1, type: 'todo', startDay: d(2025, 1, 25), endDay: d(2025, 2, 1), text: 'Сделать тестовое для IP' },
  { id: 2, type: 'todo', startDay: d(2025, 1, 10), endDay: d(2025, 1, 25), text: 'Написать тесты' },
  { id: 3, type: 'done', startDay: d(2025, 1, 19), endDay: d(2025, 1, 30), text: 'Деплой' },
];

describe('groupByType', () => {
  it('раскладывает по статусам и сортирует по startDay по возрастанию', () => {
    const groups = groupByType(tasks);
    expect(groups.todo.map((t) => t.id)).toEqual([2, 1]);
    expect(groups.done.map((t) => t.id)).toEqual([3]);
    expect(groups.review).toEqual([]);
    expect(groups.in_progress).toEqual([]);
  });
});

describe('filterTasks', () => {
  it('пустой запрос возвращает все задачи', () => {
    expect(filterTasks(tasks, '  ')).toHaveLength(3);
  });

  it('ищет по описанию без учёта регистра', () => {
    expect(filterTasks(tasks, 'ТЕСТ').map((t) => t.id)).toEqual([1, 2]);
  });

  it('при вводе даты dd.mm.yyyy ищет по startDay или endDay', () => {
    expect(filterTasks(tasks, '25.01.2025').map((t) => t.id)).toEqual([1, 2]);
    expect(filterTasks(tasks, '30.01.2025').map((t) => t.id)).toEqual([3]);
    expect(filterTasks(tasks, '01.01.2030')).toEqual([]);
  });
});

describe('date utils', () => {
  it('formatDate / parseDate обратимы', () => {
    expect(formatDate(d(2025, 3, 7))).toBe('07.03.2025');
    expect(parseDate('07.03.2025')).toBe(new Date(2025, 2, 7).getTime());
  });

  it('parseDate отклоняет некорректные даты', () => {
    expect(parseDate('31.02.2025')).toBeNull();
    expect(parseDate('1.1.2025')).toBeNull();
    expect(parseDate('abc')).toBeNull();
  });

  it('maskDateInput расставляет точки', () => {
    expect(maskDateInput('19012025')).toBe('19.01.2025');
    expect(maskDateInput('1901')).toBe('19.01');
    expect(maskDateInput('19')).toBe('19');
    expect(maskDateInput('19.01.20abc25999')).toBe('19.01.2025');
  });
});
