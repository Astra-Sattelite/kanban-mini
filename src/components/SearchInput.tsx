import React from 'react';
import { SearchIcon } from './icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: Props) => (
  <label className="search">
    <span className="search__icon">
      <SearchIcon />
    </span>
    <input
      className="search__input"
      type="text"
      value={value}
      placeholder="поиск..."
      aria-label="Поиск задач"
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
