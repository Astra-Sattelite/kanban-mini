import { format, isValid, parse } from 'date-fns';

const DATE_FORMAT = 'dd.MM.yyyy';

export const formatDate = (timestamp: number): string => format(timestamp, DATE_FORMAT);

export const parseDate = (value: string): number | null => {
  const input = value.trim();
  const date = parse(input, DATE_FORMAT, new Date());
  return isValid(date) && format(date, DATE_FORMAT) === input ? date.getTime() : null;
};

export const maskDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('.');
};
