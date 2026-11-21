import { loadTasks } from './storage';
import initialTasks from '../data/tasks.json';

const mockStorage = (value: string | null) => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: { getItem: jest.fn(() => value), setItem: jest.fn() },
    configurable: true,
  });
};

const valid = { id: 1, type: 'todo', startDay: 1, endDay: 2, text: 'a' };

describe('loadTasks', () => {
  it('без сохранённых данных берёт JSON', () => {
    mockStorage(null);
    expect(loadTasks()).toHaveLength(initialTasks.length);
  });

  it('пустой массив — пустая доска', () => {
    mockStorage('[]');
    expect(loadTasks()).toEqual([]);
  });

  it('оставляет только валидные задачи', () => {
    mockStorage(JSON.stringify([valid, { id: 2 }]));
    expect(loadTasks()).toEqual([valid]);
  });

  it('если все элементы невалидны — откатывается на JSON', () => {
    mockStorage(JSON.stringify([{ id: 2 }, { foo: 'bar' }]));
    expect(loadTasks()).toHaveLength(initialTasks.length);
  });

  it('битый JSON — откатывается на JSON-файл', () => {
    mockStorage('{not json');
    expect(loadTasks()).toHaveLength(initialTasks.length);
  });
});