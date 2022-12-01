import { DrupalJsonApiParams } from '..';
test(' 1. Only get published nodes', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1');
  expect(api.getQueryString({ encode: false })).toBe('filter[status]=1');
});

test(' 2. Get nodes by a value of a entity reference', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('uid.id', 'BB09E2CD-9487-44BC-B219-3DC03D6820CD');
  expect(api.getQueryString({ encode: false })).toBe('filter[uid.id]=BB09E2CD-9487-44BC-B219-3DC03D6820CD');
  api.clear();
  api.addFilter('field_tags.meta.drupal_internal__target_id', '1');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_tags.meta.drupal_internal__target_id]=1');
});

test(' 3. Nested Filters: Get nodes created by user admin', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('uid.name', 'admin');
  expect(api.getQueryString({ encode: false })).toBe('filter[uid.name]=admin');
});

test(' 4. Filtering with arrays: Get nodes created by users [admin, john]', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('uid.name', ['admin', 'john'], 'IN');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[uid.name][condition][path]=uid.name&filter[uid.name][condition][value][0]=admin&filter[uid.name][condition][value][1]=john&filter[uid.name][condition][operator]=IN',
  );
});

test(' 5. Grouping filters: Get nodes that are published and create by admin', () => {
  let api = new DrupalJsonApiParams();
  // WHERE user.name = admin AND node.status = 1;
  api
    .addGroup('and-group', 'AND')
    .addFilter('uid.name', 'admin', '=', 'and-group')
    .addFilter('status', '1', '=', 'and-group');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[and-group][group][conjunction]=AND&filter[uid.name][condition][path]=uid.name&filter[uid.name][condition][value]=admin&filter[uid.name][condition][memberOf]=and-group&filter[status][condition][path]=status&filter[status][condition][value]=1&filter[status][condition][memberOf]=and-group',
  );
});
test(' 6. Grouping grouped filters: Get nodes that are promoted or sticky and created by admin', () => {
  let api = new DrupalJsonApiParams();
  // WHERE (user.name = admin) AND (node.sticky = 1 OR node.promoted = 1)
  api
    // Create an AND GROUP
    .addGroup('and-group', 'AND')
    // Put the OR group into the AND GROUP
    .addGroup('or-group', 'OR', 'and-group')
    // Create the admin filter and put it in the AND GROUP
    .addFilter('uid.name', 'admin', '=', 'and-group')
    // Create the sticky filter and put it in the OR GROUP
    .addFilter('sticky', '1', '=', 'or-group')
    // Create the promoted filter and put it in the OR GROUP
    .addFilter('promote', '1', '=', 'or-group');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[and-group][group][conjunction]=AND&filter[or-group][group][conjunction]=OR&filter[or-group][group][memberOf]=and-group&filter[uid.name][condition][path]=uid.name&filter[uid.name][condition][value]=admin&filter[uid.name][condition][memberOf]=and-group&filter[sticky][condition][path]=sticky&filter[sticky][condition][value]=1&filter[sticky][condition][memberOf]=or-group&filter[promote][condition][path]=promote&filter[promote][condition][value]=1&filter[promote][condition][memberOf]=or-group',
  );
});

test(' 7. Filter for nodes where "title" CONTAINS "Foo"', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('title', 'Foo', 'CONTAINS');
  expect(api.getQueryString({ encode: false })).toBe('filter[title][value]=Foo&filter[title][operator]=CONTAINS');
});

test(' 8. Filter by non-standard complex fields (e.g. addressfield)', () => {
  let api = new DrupalJsonApiParams();
  // FILTER BY LOCALITY
  api.addFilter('field_address.locality', 'Mordor');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_address.locality]=Mordor');
  api.clear();
  // FILTER BY ADDRESS LINE
  api.addFilter('field_address.address_line1', 'Rings Street');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_address.address_line1]=Rings Street');
});

test(' 9. Filtering on Taxonomy term values (e.g. tags)', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('field_tags.name', 'tagname', 'IN');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[field_tags.name][value]=tagname&filter[field_tags.name][operator]=IN',
  );
});

test('10. Filtering on Date (Date only, no time)', () => {
  let api = new DrupalJsonApiParams();
  // This example is for a Date field that is set to be date only (no time).
  api.addFilter('field_test_date', '2019-06-27');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_test_date]=2019-06-27');

  api.clear();
  // This example is for a Date field that supports date and time.
  api.addFilter('field_test_date', '2019-06-27T16:00:00');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_test_date]=2019-06-27T16:00:00');
  api.clear();
  // Note that timestamp fields (like created or changed)
  // currently must use a timestamp for filtering:
  api.addFilter('created', '448365617');
  expect(api.getQueryString({ encode: false })).toBe('filter[created]=448365617');
});

test('11. Dont shorten IS NULL or IS NOT NULL', () => {
  // see https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/filtering
  let api = new DrupalJsonApiParams();

  api.addFilter('field_test_date', null, 'IS NULL');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_test_date][condition][path]=field_test_date&filter[field_test_date][condition][operator]=IS NULL');

  api.clear();

  api.addFilter('field_test_date', null, 'IS NOT NULL');
  expect(api.getQueryString({ encode: false })).toBe('filter[field_test_date][condition][path]=field_test_date&filter[field_test_date][condition][operator]=IS NOT NULL');

  api.clear();
});
