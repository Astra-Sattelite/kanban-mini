import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import { Task, TaskType } from './types';
import { loadTasks, saveTasks } from './utils/storage';
import { filterTasks, groupByType } from './utils/tasks';
import { Column } from './components/Column';
import { SearchInput } from './components/SearchInput';
import { GhostIcon, HappyIcon, SmileIcon, UpsideDownIcon } from './components/icons';

const COLUMNS: { type: TaskType; title: string; icon: ReactNode }[] = [
  { type: 'todo', title: 'To Do', icon: <HappyIcon /> },
  { type: 'in_progress', title: 'In Progress', icon: <SmileIcon /> },
  { type: 'review', title: 'Review', icon: <UpsideDownIcon /> },
  { type: 'done', title: 'Done', icon: <GhostIcon /> },
];

export const App = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Task | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const groups = useMemo(() => groupByType(filterTasks(tasks, query)), [tasks, query]);

  const handleAdd = () => {
    if (draft) return;

    const today = startOfDay(Date.now()).getTime();
    const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
    setQuery('');
    setDraft({ id, type: 'todo', startDay: today, endDay: today, text: '' });
  };

  const handleSave = (updated: Task) => {
    if (draft && updated.id === draft.id) {
      setTasks((prev) => [...prev, updated]);
      setDraft(null);
      return;
    }
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
  };

  const handleCancelEdit = (id: number) => {
    if (draft?.id === id) setDraft(null);
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleMove = (id: number, type: TaskType) => {
    setTasks((prev) => prev.map((task) => (task.id === id && task.type !== type ? { ...task, type } : task)));
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Your tasks</h1>
        <SearchInput value={query} onChange={setQuery} />
      </header>

      <main className="board">
        {COLUMNS.map(({ type, title, icon }) => (
          <Column
            key={type}
            type={type}
            title={title}
            icon={icon}
            tasks={groups[type]}
            draft={type === 'todo' ? draft : null}
            onAdd={type === 'todo' ? handleAdd : undefined}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancelEdit={handleCancelEdit}
            onMove={handleMove}
          />
        ))}
      </main>
    </div>
  );
};
