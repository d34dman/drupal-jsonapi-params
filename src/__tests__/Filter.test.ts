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

test('Implement placeholder using FilterFunc in qs', () => {
  let api = new DrupalJsonApiParams(
    {},
    {
      useShortCutForQueryGeneration: false,
    },
  );
  api.setQsOption({ encode: false });
  api.addFilter('changed', ['0', '@current_date'], 'BETWEEN');
  {
    let qsParam = api.getQsOption();
    const now = (Date.now() / 1000).toFixed();
    qsParam = {
      ...qsParam,
      filter: (prefix: string, value: any) => {
        switch (prefix) {
          case 'filter[changed][condition][value][1]':
            return now;
          default:
            return value;
        }
      },
    };
    expect(api.getQueryString(qsParam)).toBe(
      `filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=${now}&filter[changed][condition][operator]=BETWEEN`,
    );
  }
  {
    let qsParam = api.getQsOption();
    qsParam = {
      ...qsParam,
      filter: (prefix: string, value: any) => {
        switch (prefix) {
          case 'filter[changed][condition][value][1]':
            return 'baz';
          default:
            return value;
        }
      },
    };
    expect(api.getQueryString(qsParam)).toBe(
      'filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=baz&filter[changed][condition][operator]=BETWEEN',
    );
  }
  {
    let qsParam = api.getQsOption();
    const now = (Date.now() / 1000).toFixed();
    qsParam = {
      ...qsParam,
      filter: (prefix: string, value: any) => {
        switch (value) {
          case '@current_date':
            return now;
          default:
            return value;
        }
      },
    };
    expect(api.getQueryString(qsParam)).toBe(
      `filter[changed][condition][path]=changed&filter[changed][condition][value][0]=0&filter[changed][condition][value][1]=${now}&filter[changed][condition][operator]=BETWEEN`,
    );
  }
});
