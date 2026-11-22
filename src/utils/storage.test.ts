import { loadTasks, saveTasks, KeyValueStorage } from './storage';
import initialTasks from '../data/tasks.json';

const fakeStorage = (value: string | null = null): KeyValueStorage => ({
  getItem: jest.fn(() => value),
  setItem: jest.fn(),
});

const valid = { id: 1, type: 'todo', startDay: 1, endDay: 2, text: 'a' };

describe('loadTasks', () => {
  it('без сохранённых данных берёт JSON', () => {
    expect(loadTasks(fakeStorage(null))).toHaveLength(initialTasks.length);
  });

  it('пустой массив — пустая доска', () => {
    expect(loadTasks(fakeStorage('[]'))).toEqual([]);
  });

  it('оставляет только валидные задачи', () => {
    expect(loadTasks(fakeStorage(JSON.stringify([valid, { id: 2 }])))).toEqual([valid]);
  });

  it('если все элементы невалидны — откатывается на JSON', () => {
    expect(loadTasks(fakeStorage(JSON.stringify([{ id: 2 }, { foo: 'bar' }])))).toHaveLength(initialTasks.length);
  });

  it('битый JSON — откатывается на JSON-файл', () => {
    expect(loadTasks(fakeStorage('{not json'))).toHaveLength(initialTasks.length);
  });

  it('если хранилище бросает исключение — откатывается на JSON-файл', () => {
    const broken: KeyValueStorage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: jest.fn(),
    };
    expect(loadTasks(broken)).toHaveLength(initialTasks.length);
  });

  it('если хранилища нет вовсе — откатывается на JSON-файл', () => {
    expect(loadTasks(null)).toHaveLength(initialTasks.length);
  });
});

describe('saveTasks', () => {
  it('пишет JSON под ключом kanban.tasks', () => {
    const storage = fakeStorage();

    saveTasks([], storage);

    expect(storage.setItem).toHaveBeenCalledWith('kanban.tasks', '[]');
  });

  it('не падает и пишет предупреждение, если запись не удалась', () => {
    const storage: KeyValueStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(() => {
        throw new Error('QuotaExceededError');
      }),
    };
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => saveTasks([], storage)).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
  });

  it('ничего не делает, если хранилища нет', () => {
    expect(() => saveTasks([], null)).not.toThrow();
  });
});
