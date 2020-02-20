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
    .addGroup('publish_status')
    .addFilter('status', '1', '=', 'publish_status')
    .addFilter('status', '2', '!=', 'publish_status');
  expect(api.getQueryString()).toBe(
    'filter%5B1%5D%5Bcondition%5D%5Bpath%5D=status&filter%5B1%5D%5Bcondition%5D%5Bvalue%5D=2&filter%5B1%5D%5Bcondition%5D%5Boperator%5D=%21%3D&filter%5B1%5D%5Bcondition%5D%5Bgroup%5D=publish_status&filter%5Bstatus%5D%5Bcondition%5D%5Bpath%5D=status&filter%5Bstatus%5D%5Bcondition%5D%5Bvalue%5D=1&filter%5Bstatus%5D%5Bcondition%5D%5Bgroup%5D=publish_status&group%5Bpublish_status%5D%5Bconjunction%5D=OR',
  );
});

test('Add Group for `status = 1` in group publish_status', () => {
  let api = new DrupalJsonApiParams();
  api.addGroup('publish_status').addFilter('status', '1', 'publish_status');
  expect(api.getQueryString()).toBe(
    'filter%5Bstatus%5D%5Bcondition%5D%5Bpath%5D=status&filter%5Bstatus%5D%5Bcondition%5D%5Bvalue%5D=1&filter%5Bstatus%5D%5Bcondition%5D%5Boperator%5D=publish_status&group%5Bpublish_status%5D%5Bconjunction%5D=OR',
  );
});

test('Add Groups to Group', () => {
  let api = new DrupalJsonApiParams();
  api
    .addGroup('child_group_A', 'OR', 'parent_group')
    .addGroup('child_group_B', 'AND', 'parent_group')
    .addGroup('parent_group', 'AND');
  expect(api.getQueryString()).toBe(
    'group%5Bchild_group_A%5D%5Bconjunction%5D=OR&group%5Bchild_group_A%5D%5BmemberOf%5D=parent_group&group%5Bchild_group_B%5D%5Bconjunction%5D=AND&group%5Bchild_group_B%5D%5BmemberOf%5D=parent_group&group%5Bparent_group%5D%5Bconjunction%5D=AND',
  );
});

test('Add Include', () => {
  let api = new DrupalJsonApiParams();
  api.addInclude(['field_a.id', 'field_b.uid', 'field_c.tid']);
  expect(api.getQueryString()).toBe('include=field_a.id%2Cfield_b.uid%2Cfield_c.tid');
});

test('Add Fields', () => {
  let api = new DrupalJsonApiParams();
  api.addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid']).addFields('node--blog', ['a', 'b', 'c']);
  expect(api.getQueryString()).toBe(
    'fields%5Bnode--article%5D=field_a.id%2Cfield_b.uid%2Cfield_c.tid&fields%5Bnode--blog%5D=a%2Cb%2Cc',
  );
});

test('Add Pager with limit 5', () => {
  let api = new DrupalJsonApiParams();
  api.addPageLimit(5);
  expect(api.getQueryString()).toBe('page%5Blimit%5D=5');
});

test('Add sort by status', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status');
  expect(api.getQueryString()).toBe('sort=status');
});

test('Add sort by status DESC', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status', 'DESC');
  expect(api.getQueryString()).toBe('sort=-status');
});

test('Add multiple sort criterion', () => {
  let api = new DrupalJsonApiParams();
  api
    .addSort('id', 'DESC')
    .addSort('uid')
    .addSort('status');
  expect(api.getQueryString()).toBe('sort=-id%2Cuid%2Cstatus');
});

test("Nova's Ark", () => {
  let api = new DrupalJsonApiParams();
  api
    // Add Group within Groups.
    .addGroup('publish_status', 'OR', 'parent_group')
    .addGroup('child_group_B', 'AND', 'parent_group')
    .addGroup('parent_group', 'AND')
    // Add Filters.
    .addFilter('status', '1')
    // Add Filter to Group.
    .addFilter('status', '2', '!=', 'publish_status')
    // Add Page Limit.
    .addPageLimit(5)
    // Add Fields.
    .addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid'])
    // Add Includes.
    .addInclude(['field_a.id', 'field_b.uid', 'field_c.tid'])
    // Add multiple sort criterion.
    .addSort('id', 'DESC')
    .addSort('uid')
    .addSort('status');
  expect(api.getQueryString()).toBe(
    'filter%5B1%5D%5Bcondition%5D%5Bpath%5D=status&filter%5B1%5D%5Bcondition%5D%5Bvalue%5D=2&filter%5B1%5D%5Bcondition%5D%5Boperator%5D=%21%3D&filter%5B1%5D%5Bcondition%5D%5Bgroup%5D=publish_status&filter%5Bstatus%5D=1&group%5Bpublish_status%5D%5Bconjunction%5D=OR&group%5Bpublish_status%5D%5BmemberOf%5D=parent_group&group%5Bchild_group_B%5D%5Bconjunction%5D=AND&group%5Bchild_group_B%5D%5BmemberOf%5D=parent_group&group%5Bparent_group%5D%5Bconjunction%5D=AND&include=field_a.id%2Cfield_b.uid%2Cfield_c.tid&page%5Blimit%5D=5&sort=-id%2Cuid%2Cstatus&fields%5Bnode--article%5D=field_a.id%2Cfield_b.uid%2Cfield_c.tid',
  );
});
