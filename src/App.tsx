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
  const [draftId, setDraftId] = useState<number | null>(null);

  useEffect(() => {
    saveTasks(tasks.filter((task) => task.id !== draftId));
  }, [tasks, draftId]);

  const groups = useMemo(() => groupByType(filterTasks(tasks, query)), [tasks, query]);

  const handleAdd = () => {
    const today = startOfDay(Date.now()).getTime();
    const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
    setQuery('');
    setTasks((prev) => [...prev, { id, type: 'todo', startDay: today, endDay: today, text: '' }]);
    setDraftId(id);
  };

  const handleSave = (updated: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
    if (updated.id === draftId) setDraftId(null);
  };

  const handleCancelEdit = (id: number) => {
    if (id !== draftId) return;
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setDraftId(null);
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (id === draftId) setDraftId(null);
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
            draftId={draftId}
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
