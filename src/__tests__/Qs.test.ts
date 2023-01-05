import { DrupalJsonApiParams } from '../index';

test('Test getter and setter for `qs` options', () => {
    let api = new DrupalJsonApiParams();
    api.setQsOption({a: 'b'});
    expect(api.getQsOption()).toStrictEqual({a: 'b'});
});

test('Test qs.tringify options', () => {
    let api = new DrupalJsonApiParams();
    api.addFilter('status', '1');
    expect(api.getQueryString({encode: false})).toBe('filter[status]=1');
    api.setQsOption({ addQueryPrefix: true, encode: false });
    expect(api.getQueryString()).toBe('?filter[status]=1');
    expect(api.getQueryString({})).toBe('filter%5Bstatus%5D=1');
    expect(api.getQueryString()).toBe('?filter[status]=1');
});

test('Test qs.parse options', () => {
    let api = new DrupalJsonApiParams();
    api.setQsOption({encode: false, ignoreQueryPrefix: true});
    api.initializeWithQueryString('?a=b&c=d');
    expect(api.getQueryString()).toBe('a=b&c=d');

    let api2 = new DrupalJsonApiParams();
    api.setQsOption({encode: false});
    api.initializeWithQueryString('?a=b&c=d');
    expect(api.getQueryString()).toBe('?a=b&c=d');
});


test('Test initializeWithQueryString with options', () => {
    let api = new DrupalJsonApiParams();
    api.initializeWithQueryString('?a=b&c=d', {ignoreQueryPrefix: true});
    expect(api.getQueryString({encode: false})).toBe('a=b&c=d');
});

