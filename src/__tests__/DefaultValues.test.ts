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


test('Filter for `status = 1` && `status != 2` in group=publish_status', () => {
  let api = new DrupalJsonApiParams();
  api
    .addFilter('status', '1', '=', 'publish_status')
    .addFilter('status', '2', '!=', 'publish_status');
  expect(api.getQueryString()).toBe(
    'filter%5B1%5D%5Bcondition%5D%5Bpath%5D=status&filter%5B1%5D%5Bcondition%5D%5Bvalue%5D=2&filter%5B1%5D%5Bcondition%5D%5Boperator%5D=%21%3D&filter%5B1%5D%5Bcondition%5D%5Bgroup%5D=publish_status&filter%5Bstatus%5D%5Bcondition%5D%5Bpath%5D=status&filter%5Bstatus%5D%5Bcondition%5D%5Bvalue%5D=1&filter%5Bstatus%5D%5Bcondition%5D%5Bgroup%5D=publish_status',
  );
});
