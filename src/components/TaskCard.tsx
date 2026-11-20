import React, { useState } from 'react';
import { Task } from '../types';
import { formatDate, maskDateInput, parseDate } from '../utils/date';
import { isTaskOverdue } from '../utils/overdue';
import { CheckIcon, CrossIcon, EditIcon, TrashIcon } from './icons';

interface Props {
  task: Task;
  startInEditing?: boolean;
  onSave: (task: Task) => void;
  onDelete: (id: number) => void;
  onCancelEdit: (id: number) => void;
}

interface Errors {
  start: boolean;
  end: boolean;
  text: boolean;
}

const NO_ERRORS: Errors = { start: false, end: false, text: false };

export const TaskCard = ({ task, startInEditing = false, onSave, onDelete, onCancelEdit }: Props) => {
  const [editing, setEditing] = useState(startInEditing);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(formatDate(task.startDay));
  const [end, setEnd] = useState(formatDate(task.endDay));
  const [text, setText] = useState(task.text);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);

  const overdue = isTaskOverdue(task);
  const canEdit = task.type === 'todo';

  const startEditing = () => {
    setStart(formatDate(task.startDay));
    setEnd(formatDate(task.endDay));
    setText(task.text);
    setErrors(NO_ERRORS);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setErrors(NO_ERRORS);
    onCancelEdit(task.id);
  };

  const save = () => {
    const startDay = parseDate(start);
    const endDay = parseDate(end);
    const description = text.trim();

    const next: Errors = {
      start: startDay === null,
      end: endDay === null || (startDay !== null && endDay < startDay),
      text: description === '',
    };
    setErrors(next);
    if (next.start || next.end || next.text || startDay === null || endDay === null) return;

    onSave({ ...task, startDay, endDay, text: description });
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      cancel();
    }
  };

  if (editing) {
    return (
      <div className="card card--editing" onKeyDown={onKeyDown}>
        <div className="card__row">
          <span className="card__label">Начало:</span>
          <input
            className={`field${errors.start ? ' field--error' : ''}`}
            value={start}
            placeholder="дд.мм.гггг"
            inputMode="numeric"
            autoFocus
            aria-label="Дата начала"
            onChange={(e) => setStart(maskDateInput(e.target.value))}
          />
        </div>
        <div className="card__row">
          <span className="card__label">Окончание:</span>
          <input
            className={`field${errors.end ? ' field--error' : ''}`}
            value={end}
            placeholder="дд.мм.гггг"
            inputMode="numeric"
            aria-label="Дата окончания"
            onChange={(e) => setEnd(maskDateInput(e.target.value))}
          />
        </div>
        <div className="card__row">
          <span className="card__label">Описание:</span>
          <input
            className={`field${errors.text ? ' field--error' : ''}`}
            value={text}
            aria-label="Описание"
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="card__buttons">
          <button type="button" className="round-btn round-btn--cancel" aria-label="Отменить" onClick={cancel}>
            <CrossIcon />
          </button>
          <button type="button" className="round-btn round-btn--done" aria-label="Сохранить" onClick={save}>
            <CheckIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card${overdue ? ' card--overdue' : ''}${dragging ? ' card--dragging' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(task.id));
        e.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
    >
      <div className="card__actions">
        {canEdit && (
          <button type="button" className="icon-btn icon-btn--edit" aria-label="Редактировать" onClick={startEditing}>
            <EditIcon />
          </button>
        )}
        <button type="button" className="icon-btn icon-btn--trash" aria-label="Удалить" onClick={() => onDelete(task.id)}>
          <TrashIcon />
        </button>
      </div>

      <div className="card__row">
        <span className="card__label">Начало:</span>
        <span className="card__value">{formatDate(task.startDay)}</span>
      </div>
      <div className="card__row">
        <span className="card__label">Окончание:</span>
        <span className={`card__value${overdue ? ' card__value--overdue' : ''}`}>{formatDate(task.endDay)}</span>
      </div>
      <div className="card__row">
        <span className="card__label">Описание:</span>
        <span className="card__value">{task.text}</span>
      </div>
    </div>
  );
};
