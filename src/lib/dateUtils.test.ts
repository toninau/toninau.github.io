import { describe, test, expect, assert } from 'vitest';
import { parseIsoDateString, formatIsoDate, formatClientDate } from './dateUtils';

describe('dateUtils', () => {
  test('parseIsoDateString', () => {
    expect(parseIsoDateString('2024-28-9')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('2024-2-09')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('09-28-2024')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('28-09-2024')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('09-2024-28')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('28-2024-09')).toEqual(new Date('invalid date'));

    expect(parseIsoDateString('2024-28--09')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('2024--28-09')).toEqual(new Date('invalid date'));
    expect(parseIsoDateString('2024.28.09')).toEqual(new Date('invalid date'));

    expect(parseIsoDateString(null)).toEqual(new Date('invalid date'));
    expect(parseIsoDateString(undefined)).toEqual(new Date('invalid date'));
    expect(parseIsoDateString(12)).toEqual(new Date('invalid date'));
    expect(parseIsoDateString({})).toEqual(new Date('invalid date'));

    expect(parseIsoDateString('2024-09-28')).toEqual(new Date(2024, 8, 28));
    expect(parseIsoDateString('2024-01-01')).toEqual(new Date(2024, 0, 1));
    expect(parseIsoDateString('2024-12-31')).toEqual(new Date(2024, 11, 31));
  });

  test('formatIsoDate', () => {
    expect(formatIsoDate(new Date(2024, 8, 28))).toBe('2024-09-28');
    expect(formatIsoDate(new Date(2024, 0, 1))).toBe('2024-01-01');
    expect(formatIsoDate(new Date(2024, 11, 31))).toBe('2024-12-31');
    expect(formatIsoDate(new Date(2000, 1, 1))).toBe('2000-02-01');

    assert.throws(() => formatIsoDate(new Date('invalid date')), RangeError, 'Invalid time value');
  });

  test('formatClientDate', () => {
    expect(formatClientDate(new Date(2024, 8, 28))).toBe('September 28, 2024');
    expect(formatClientDate(new Date(2024, 0, 1))).toBe('January 1, 2024');
    expect(formatClientDate(new Date(2024, 11, 31))).toBe('December 31, 2024');
    expect(formatClientDate(new Date(2000, 1, 1))).toBe('February 1, 2000');
  });
});
