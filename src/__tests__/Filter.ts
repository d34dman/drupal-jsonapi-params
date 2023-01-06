import { DrupalJsonApiParams } from '../index';

test('Filter for `status = 1` with custom key', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1', '=', '', 'foo');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[foo][condition][path]=status&filter[foo][condition][value]=1&filter[foo][condition][memberOf]=',
  );
});

test('Filter for `status = 1` with custom key used twice', () => {
  let api = new DrupalJsonApiParams();
  api.addFilter('status', '1', '=', '', 'foo');
  api.addFilter('status', '1', '=', '', 'foo');
  expect(api.getQueryString({ encode: false })).toBe(
    'filter[foo][condition][path]=status&filter[foo][condition][value]=1&filter[foo][condition][memberOf]=&filter[foo--1][condition][path]=status&filter[foo--1][condition][value]=1&filter[foo--1][condition][memberOf]=',
  );
});
