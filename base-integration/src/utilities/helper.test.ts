import {
  describe,
  it,
  expect,
} from '@jest/globals';
import { Helper } from './helper';

describe('running-test', () => {
  describe('csvContentChecker', () => {
    it('should encode quotes', async () => {
      const content = `hello "big" world`;
      const encoded = Helper.csvContentChecker(content);
      expect(encoded).toBe(`"hello ""big"" world"`);
    });
    it('should encode commas', async () => {
      const content = `hello, or not`;
      const encoded = Helper.csvContentChecker(content);
      expect(encoded).toBe(`"hello, or not"`);
    });
    it('should encode both quotes and commas', async () => {
      const content = `h "and," or something else, or "not"`;
      const encoded = Helper.csvContentChecker(content);
      expect(encoded).toBe(`"h ""and,"" or something else, or ""not"""`);
    });
    it('should return normal text', async () => {
      const content = `hello world`;
      const encoded = Helper.csvContentChecker(content);
      expect(encoded).toBe(`hello world`);
    });
  })
})
