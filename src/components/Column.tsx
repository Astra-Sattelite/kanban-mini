import React, { ReactNode, useState } from 'react';
import { Task, TaskType } from '../types';
import { TaskCard } from './TaskCard';

interface Props {
  type: TaskType;
  title: string;
  icon: ReactNode;
  tasks: Task[];
  draftId: number | null;
  onAdd?: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: number) => void;
  onCancelEdit: (id: number) => void;
  onMove: (id: number, type: TaskType) => void;
}

export const Column = ({ type, title, icon, tasks, draftId, onAdd, onSave, onDelete, onCancelEdit, onMove }: Props) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <section
      className={`column${dragOver ? ' column--drag-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const id = Number(e.dataTransfer.getData('text/plain'));
        if (!Number.isNaN(id)) onMove(id, type);
      }}
    >
      <header className="column__header">
        <h2 className="column__title">
          <span className="column__icon">{icon}</span>
          {title}
        </h2>
        {onAdd && (
          <button type="button" className="column__add" onClick={onAdd}>
            + Добавить
          </button>
        )}
      </header>

      <div className="column__list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            startInEditing={task.id === draftId}
            onSave={onSave}
            onDelete={onDelete}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </div>
    </section>
  );
};
