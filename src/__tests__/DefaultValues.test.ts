import { DrupalJsonApiParams } from '../index';
test('Empty Default Values', () => {
  let api = new DrupalJsonApiParams();
  expect(api.getQueryString()).toBe('');
});

test('Filter for `status = 1`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  expect(decodeURIComponent(api.getQueryString())).toBe('filter[status]=1');
});

test('Filter for `status = 1` && `status = 2`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1').addFilter('status', '2');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[1][condition][path]=status&filter[1][condition][value]=2&filter[status]=1',
  );
});

test('Filter for `status = null`', () => {
  let api = new DrupalJsonApiParams();
  expect(() => {
    api.addFilter('status', null);
  }).toThrow(TypeError);
});

test('Filter for `status = [1, 20]`', () => {
  let api = new DrupalJsonApiParams();
  expect(() => {
    api.addFilter('status', ['1', '20']);
  }).toThrow(TypeError);
});

test('Filter for `status IS NULL`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', null, 'IS NULL');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL',
  );
});
test('Filter for `status IS NULL` in valid', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', null, 'IS NULL', 'valid');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL&filter[status][condition][memberOf]=valid',
  );
});

test('Filter for `status IS NOT NULL`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', null, 'IS NOT NULL');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NOT NULL',
  );
});

test('Filter for `changed is BETWEEN 0 AND 123456789`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'BETWEEN');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=BETWEEN',
  );
});

test('Filter for `changed is BETWEEN 0 AND 123456789` in range', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'BETWEEN', 'range');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=BETWEEN&filter[changed][condition][memberOf]=range',
  );
});

test('Filter for `changed is NOT BETWEEN 0 AND 123456789`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'NOT BETWEEN');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=NOT BETWEEN',
  );
});

test('Filter for `status = 1` && `status != 2` in group=publish_status', () => {
  let api = new DrupalJsonApiParams();
  api
    .addGroup('publish_status')
    .addFilter('status', '1', '=', 'publish_status')
    .addFilter('status', '2', '!=', 'publish_status');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[2][condition][path]=status&filter[2][condition][value]=2&filter[2][condition][operator]=!=&filter[2][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][memberOf]=publish_status',
  );
});

test('Add Group for `status = 1` in group publish_status', () => {
  let api = new DrupalJsonApiParams();
  api.addGroup('publish_status').addFilter('status', '1', '=', 'publish_status');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[publish_status][group][conjunction]=OR&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][memberOf]=publish_status',
  );
});

test('Add Groups to Group', () => {
  let api = new DrupalJsonApiParams();
  api
    .addGroup('child_group_A', 'OR', 'parent_group')
    .addGroup('child_group_B', 'AND', 'parent_group')
    .addGroup('parent_group', 'AND');
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[child_group_A][group][conjunction]=OR&filter[child_group_A][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND',
  );
});

test('Add Include', () => {
  let api = new DrupalJsonApiParams();
  api.addInclude(['field_a.id', 'field_b.uid', 'field_c.tid']);
  expect(decodeURIComponent(api.getQueryString())).toBe('include=field_a.id,field_b.uid,field_c.tid');
});

test('Add Fields', () => {
  let api = new DrupalJsonApiParams();
  api.addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid']).addFields('node--blog', ['a', 'b', 'c']);
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'fields[node--article]=field_a.id,field_b.uid,field_c.tid&fields[node--blog]=a,b,c',
  );
});

test('Add Pager with limit 5', () => {
  let api = new DrupalJsonApiParams();
  api.addPageLimit(5);
  expect(decodeURIComponent(api.getQueryString())).toBe('page[limit]=5');
});

test('Add sort by status', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status');
  expect(decodeURIComponent(api.getQueryString())).toBe('sort=status');
});

test('Add sort by status DESC', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status', 'DESC');
  expect(decodeURIComponent(api.getQueryString())).toBe('sort=-status');
});

test('Add multiple sort criterion', () => {
  let api = new DrupalJsonApiParams();
  api
    .addSort('id', 'DESC')
    .addSort('uid')
    .addSort('status');
  expect(decodeURIComponent(api.getQueryString())).toBe('sort=-id,uid,status');
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
  expect(decodeURIComponent(api.getQueryString())).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid',
  );
});
