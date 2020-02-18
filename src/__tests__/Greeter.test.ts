import { DrupalJsonApiParams } from '../index';
test('My Greeter', () => {
  expect(DrupalJsonApiParams('Carl')).toBe('Hello Carl');
});