import { getDayFormat, zeroPadding, getTimeFormat, getDateFormat } from './util';
jest.unmock('./util');

describe('util', () => {
  describe('zeroPadding()', () => {
    it('1 digit for both number and length', () => {
      expect(zeroPadding(1, 1)).toBe('1');
    });
    it('1 digit for number, 2 digits for length', () => {
      expect(zeroPadding(2, 2)).toBe('02');
    });
    it('2 digits for both number and length', () => {
      expect(zeroPadding(34, 2)).toBe('34');
    });
  });

  describe('getDayFormat()', () => {
    it('no parameter', () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      expect(getDayFormat()).toBe(expected);
    });
    it('with date parameter', () => {
      const date = new Date(2018, 2, 9);
      expect(getDayFormat(date)).toBe('2018-3-9');
    });
  });

  describe('getTimeFormat()', () => {
    it('1 digit for both hour and minute', () => {
      expect(getTimeFormat(1, 0)).toBe('01:00');
    });
    it('2 digits for both hour and minute', () => {
      expect(getTimeFormat(10, 59)).toBe('10:59');
    });
  });

  describe('getDateFormat()', () => {
    it('no parameter', () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${zeroPadding(
        now.getHours(),
        2
      )}:${zeroPadding(now.getMinutes(), 2)}`;
      expect(getDateFormat()).toBe(expected);
    });
    it('with date parameter', () => {
      const date = new Date(2020, 0, 11, 22, 26);
      expect(getDateFormat(date)).toBe('2020-1-11 22:26');
    });
  });
});
