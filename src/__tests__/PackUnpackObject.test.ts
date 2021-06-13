import { DrupalJsonApiParams } from '../index';
test('Empty Default Values', () => {
  let api = new DrupalJsonApiParams();
  let obj = api.getQueryObject();
  expect(api.getQueryString()).toBe('');
  api.clear();
  expect(api.getQueryString()).toBe('');
  api.initializeWithQueryObject(obj);
  expect(api.getQueryString()).toBe('');
  api.initializeWithQueryObject({});
  expect(api.getQueryString()).toBe('');
});

test('getDrupalJsonApiParams', () => {
  const getDrupalJsonApiParams = function(input: any = undefined) {
    return new DrupalJsonApiParams().initialize(input);
  };
  // Defaults.
  expect(getDrupalJsonApiParams()).toStrictEqual(expect.any(DrupalJsonApiParams));
  expect(getDrupalJsonApiParams('')).toStrictEqual(expect.any(DrupalJsonApiParams));
  expect(getDrupalJsonApiParams({})).toStrictEqual(expect.any(DrupalJsonApiParams));
  expect(getDrupalJsonApiParams(new DrupalJsonApiParams().getQueryString())).toStrictEqual(
    expect.any(DrupalJsonApiParams),
  );
  expect(getDrupalJsonApiParams(new DrupalJsonApiParams().getQueryObject())).toStrictEqual(
    expect.any(DrupalJsonApiParams),
  );
  // Incorrectly normalized query object.
  const badObject = { include: [], sort: [] };
  expect(getDrupalJsonApiParams(badObject)).toStrictEqual(expect.any(DrupalJsonApiParams));
});

test('Filter for `status = 1`', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  let obj = api.getQueryObject();
  expect(api.getQueryString({ encode: false })).toBe('filter[status]=1');
  api.clear();
  expect(api.getQueryString()).toBe('');
  api.initializeWithQueryObject(obj);
  expect(api.getQueryString({ encode: false })).toBe('filter[status]=1');
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
    .addSort('status');
  let obj = api.getQueryObject();
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid',
  );
  api.clear();
  expect(api.getQueryString()).toBe('');
  api.initializeWithQueryObject(obj);
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[4][condition][path]=status&filter[4][condition][value]=2&filter[4][condition][operator]=!=&filter[4][condition][memberOf]=publish_status&filter[publish_status][group][conjunction]=OR&filter[publish_status][group][memberOf]=parent_group&filter[child_group_B][group][conjunction]=AND&filter[child_group_B][group][memberOf]=parent_group&filter[parent_group][group][conjunction]=AND&filter[status]=1&include=field_a.id,field_b.uid,field_c.tid&page[limit]=5&sort=-id,uid,status&fields[node--article]=field_a.id,field_b.uid,field_c.tid',
  );
});
