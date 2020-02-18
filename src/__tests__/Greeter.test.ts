import { DrupalJsonApiParams } from '../index';
test('My Greeter', () => {
  let Person = new DrupalJsonApiParams('World');
  expect(Person.greet()).toBe('Hello, World');
});