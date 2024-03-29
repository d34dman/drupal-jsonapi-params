import { DrupalJsonApiParams } from '../index';

test('Empty Default Values', () => {
  let api = new DrupalJsonApiParams();
  expect(api.getQueryString()).toBe('');
});

test('Filter for `status = 1`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  expect(api.getQueryString({ encode: false })).toBe('filter[status]=1');
});

test('Filter for `status = 1` twice', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  api.addFilter('status', '1');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[1][condition][path]=status&filter[1][condition][value]=1&filter[status]=1',
  );
});

test('Filter for `status = 1` without using shortcuts', () => {
  let api = new DrupalJsonApiParams(
    {},
    {
      useShortCutForQueryGeneration: false,
    },
  );
  api.addFilter('status', '1');
  api.addFilter('status', '1');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[1][condition][path]=status&filter[1][condition][value]=1&filter[1][condition][operator]==&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][operator]==',
  );
});

test('Filter for `status = 1` with field names for keys and no shortcuts', () => {
  let api = new DrupalJsonApiParams(
    'filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][operator]==&filter[status--2][condition][path]=status&filter[status--2][condition][value]=1&filter[status--2][condition][operator]==',
    {
      useShortCutForQueryGeneration: false,
      alwaysUseFieldNameForKeys: true,
    },
  );
  api.addFilter('status', '1');
  api.addFilter('status', '1');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][operator]==&filter[status--2][condition][path]=status&filter[status--2][condition][value]=1&filter[status--2][condition][operator]==&filter[status--1][condition][path]=status&filter[status--1][condition][value]=1&filter[status--1][condition][operator]==&filter[status--3][condition][path]=status&filter[status--3][condition][value]=1&filter[status--3][condition][operator]==',
  );
});

test('Filter for `status = 1` && `status = 2`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1').addFilter('status', '2');
  expect(api.getQueryString({ encode: false })).toBe(
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
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL',
  );
});

test('Filter for `status IS NULL` for non-null values', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', ['random'], 'IS NULL');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL',
  );

  let api2 = new DrupalJsonApiParams();
  api2.addFilter('status', '', 'IS NULL');
  expect(api2.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL',
  );
});

test('Filter for `status IS NULL` in valid', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', null, 'IS NULL', 'valid');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NULL&filter[status][condition][memberOf]=valid',
  );
});

test('Filter for `status IS NOT NULL`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', null, 'IS NOT NULL');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[status][condition][path]=status&filter[status][condition][operator]=IS NOT NULL',
  );
});

test('Filter for `changed is BETWEEN 0 AND 123456789`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'BETWEEN');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=BETWEEN',
  );
});

test('Filter for `changed is BETWEEN 0 AND 123456789` in range', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'BETWEEN', 'range');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=BETWEEN&filter[changed][condition][memberOf]=range',
  );
});

test('Filter for `changed is BETWEEN 0 AND 2 AND 2` in range', () => {
  let api = new DrupalJsonApiParams();
  expect(() => {
    api.addFilter('changed', ['0', '1', '2'], 'BETWEEN', 'range');
  }).toThrow(TypeError);
});

test('Filter for `changed is BETWEEN 0` in range', () => {
  let api = new DrupalJsonApiParams();
  expect(() => {
    api.addFilter('changed', ['0'], 'BETWEEN', 'range');
  }).toThrow(TypeError);
});

test('Filter for `changed is NOT BETWEEN 0 AND 123456789`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('changed', ['0', '123456789'], 'NOT BETWEEN');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=123456789&filter[changed][condition][operator]=NOT BETWEEN',
  );
});

test('Filter for `id IN ["1", "2", "3"]`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('id', ['1', '2', '3'], 'IN');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[id][condition][path]=id&filter[id][condition][value][0]=1&filter[id][condition][value][1]=2&filter[id][condition][value][2]=3&filter[id][condition][operator]=IN',
  );
});

test('Filter for `status = 1` && `status != 2` in group=publish_status', () => {
  let api = new DrupalJsonApiParams();
  api
    .addGroup('publish_status')
    .addFilter('status', '1', '=', 'publish_status')
    .addFilter('status', '2', '!=', 'publish_status');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[2][condition][path]=status&filter[2][condition][value]=2&filter[2][condition][operator]=!=&filter[2][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][memberOf]=publish_status',
  );
});

test('Add Group for `status = 1` in group publish_status', () => {
  let api = new DrupalJsonApiParams();
  api.addGroup('publish_status').addFilter('status', '1', '=', 'publish_status');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[publish_status][group][conjunction]=OR&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][memberOf]=publish_status',
  );
});

test('Add Groups to Group', () => {
  let api = new DrupalJsonApiParams();
  api
    .addGroup('child_group_A', 'OR', 'parent_group')
    .addGroup('child_group_B', 'AND', 'parent_group')
    .addGroup('parent_group', 'AND');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[child_group_A][group][conjunction]=OR&filter[child_group_A][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND',
  );
});

test('Add Include', () => {
  let api = new DrupalJsonApiParams();
  api.addInclude(['field_a.id', 'field_b.uid', 'field_c.tid']);
  expect(api.getQueryString({ encode: false })).toBe('include=field_a.id,field_b.uid,field_c.tid');
});

test('Add Fields', () => {
  let api = new DrupalJsonApiParams();
  api.addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid']).addFields('node--blog', ['a', 'b', 'c']);
  expect(api.getQueryString({ encode: false })).toBe(
    'fields[node--article]=field_a.id,field_b.uid,field_c.tid&fields[node--blog]=a,b,c',
  );
});

test('Add Pager with limit 5', () => {
  let api = new DrupalJsonApiParams();
  api.addPageLimit(5);
  expect(api.getQueryString({ encode: false })).toBe('page[limit]=5');
});

test('Add Pager with offset 3', () => {
  let api = new DrupalJsonApiParams();
  api.addPageOffset(3);
  expect(api.getQueryString({ encode: false })).toBe('page[offset]=3');
});

test('Point pager to 3rd page with 5 items per page', () => {
  let api = new DrupalJsonApiParams();
  // Page limit is 5, because we take 5 items per page.
  api.addPageLimit(5);
  // Offset is 10, which is a way of saying skip all items from
  // first two pages. Since there are two pages with 5 items each
  // we skip 5*2 items, i.e. 10 items.
  api.addPageOffset(10);
  expect(api.getQueryString({ encode: false })).toBe('page[limit]=5&page[offset]=10');
});

test('Point pager to 3rd page with 5 items per page - alternate approach', () => {
  // This test is to check that irrespective of the order in which
  // the offset/limit are entered, the query is generated properly.
  let api = new DrupalJsonApiParams();
  api.addPageOffset(10);
  api.addPageLimit(5);
  expect(api.getQueryString({ encode: false })).toBe('page[offset]=10&page[limit]=5');
});

test('Add sort by status', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status');
  expect(api.getQueryString({ encode: false })).toBe('sort=status');
});

test('Add sort by status DESC', () => {
  let api = new DrupalJsonApiParams();
  api.addSort('status', 'DESC');
  expect(api.getQueryString({ encode: false })).toBe('sort=-status');
});

test('Add multiple sort criterion', () => {
  let api = new DrupalJsonApiParams();
  api
    .addSort('id', 'DESC')
    .addSort('uid')
    .addSort('status');
  expect(api.getQueryString({ encode: false })).toBe('sort=-id,uid,status');
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
    .addPageOffset(3)
    // Add Fields.
    .addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid'])
    // Add Includes.
    .addInclude(['field_a.id', 'field_b.uid', 'field_c.tid'])
    // Add multiple sort criterion.
    .addSort('id', 'DESC')
    .addSort('uid')
    .addSort('status');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&page[offset]=3&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid',
  );
});
