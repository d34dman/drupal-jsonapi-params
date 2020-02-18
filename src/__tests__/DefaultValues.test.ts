import { DrupalJsonApiParams } from '../index';
test('Empty Default Values', () => {
  let api = new DrupalJsonApiParams();
  expect(api.getQueryString()).toBe('');
});