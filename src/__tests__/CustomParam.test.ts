import { DrupalJsonApiParams } from '../index';
test('Custom parameters', () => {
  let api = new DrupalJsonApiParams();
  api.clear();
  api.addCustomParam({ foo: 'bar' });
  expect(api.getQueryString({ encode: false })).toBe('foo=bar');
  api.addCustomParam({ foo: { bar: 'baz' } });
  api.addCustomParam({ bar: ['a', 'b', 'c'] });
  expect(api.getQueryString({ encode: false })).toBe('foo[bar]=baz&bar[0]=a&bar[1]=b&bar[2]=c');
  api.clear();
  expect(api.getQueryString()).toBe('');
  expect(api.addCustomParam({ foo: 'bar' })).toBeInstanceOf(DrupalJsonApiParams);
});

test("Nova's Ark with custom params", () => {
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
  api.clear();
  expect(api.getQueryString()).toBe('');
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
    .addSort('status')
    .addCustomParam({ foo: 'bar' });
  let queryString = api.getQueryString();
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid&foo=bar',
  );
  api.clear();
  expect(api.getQueryString()).toBe('');
  api.initializeWithQueryString(queryString);
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid&foo=bar',
  );
});
