import { DrupalJsonApiParams } from '../index';

describe('Overload initializer', () => {
  test('function signature', () => {
    let api = new DrupalJsonApiParams();
    expect(api.initialize('').getQueryString()).toBe('');
    expect(api.initialize({}).getQueryString()).toBe('');
    expect(api.initialize(api).getQueryString()).toBe('');
  });

  test('Filter for `status = 1`', () => {
    const api = new DrupalJsonApiParams();
    api.addFilter('status', '1');
    expect(api.getQueryString()).toBe('filter%5Bstatus%5D=1');
    const newApi = new DrupalJsonApiParams();
    expect(newApi.initialize('').getQueryString()).toBe('');
    expect(newApi.initialize('filter%5Bstatus%5D=1').getQueryString()).toBe('filter%5Bstatus%5D=1');
    expect(newApi.initialize({}).getQueryString()).toBe('');
    expect(newApi.initialize(api.getQueryObject()).getQueryString()).toBe('filter%5Bstatus%5D=1');
    expect(newApi.initialize(api).getQueryString()).toBe('filter%5Bstatus%5D=1');
  });

  test('should not corrupt parent instance', () => {
    const api = new DrupalJsonApiParams();
    api.addFilter('status', '1');
    expect(api.getQueryString()).toBe('filter%5Bstatus%5D=1');
    const newApi = new DrupalJsonApiParams().initialize(api.getQueryString());
    api.addFilter('id', ['1', '2', '3'], 'IN');
    expect(newApi.getQueryString()).toBe('filter%5Bstatus%5D=1');
    expect(api.getQueryString()).toBe(
      'filter%5Bstatus%5D=1&filter%5Bid%5D%5Bcondition%5D%5Bpath%5D=id&filter%5Bid%5D%5Bcondition%5D%5Bvalue%5D%5B0%5D=1&filter%5Bid%5D%5Bcondition%5D%5Bvalue%5D%5B1%5D=2&filter%5Bid%5D%5Bcondition%5D%5Bvalue%5D%5B2%5D=3&filter%5Bid%5D%5Bcondition%5D%5Boperator%5D=IN',
    );
  });
});
