import { DrupalJsonApiParams } from '../index';
test('Empty Default Values', () => {
  let api = new DrupalJsonApiParams();
  expect(api.getQueryString()).toBe('');
});

test('Filter for `status = 1`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  expect(api.getQueryString()).toBe('filter%5Bstatus%5D=1');
});

test('Filter for `status = 1` && `status = 2`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1').addFilter('status', '2');
  expect(api.getQueryString()).toBe(
    'filter%5B1%5D%5Bcondition%5D%5Bpath%5D=status&filter%5B1%5D%5Bcondition%5D%5Bvalue%5D=2&filter%5Bstatus%5D=1',
  );
});
