import qs = require('qs');

export interface FilterItems {
  [key: string]: FilterItemType;
}

export type FilterItemShortest = string;
export type FilterItemShort = {
  operator: string;
  value: string;
};
export type FilterItem = {
  condition?: {
    operator?: string;
    path: string;
    value?: string | string[];
    memberOf?: string;
  };
  group?: GroupItem;
};

export type FilterItemType = FilterItem | FilterItemShort | FilterItemShortest;

export interface GroupItem {
  conjunction: string;
  memberOf?: string;
}

export interface PageItem {
  limit: number;
}

export interface FieldItems {
  [key: string]: string;
}

export interface DrupalJsonApiParamsStore {
  filter: FilterItems;
  sort: string[];
  include: string[];
  page: PageItem | undefined;
  fields: FieldItems;
}

/**
 * Object representation of Query string.
 */
export interface ParamBag<TValue> {
  [id: string]: TValue;
}

export interface DrupalJsonApiParamsInterface {
  initialize(input: string | object | DrupalJsonApiParamsInterface): DrupalJsonApiParams;
  getQueryObject(): object;
}
export class DrupalJsonApiParams implements DrupalJsonApiParamsInterface {
  private data: DrupalJsonApiParamsStore = {
    filter: {},
    include: [],
    page: undefined,
    sort: [],
    fields: {},
  };

  /**
   * Optionaly initialize with a previously stored query/object/query string.
   *
   * @category Init
   */
  public constructor(input?: string | object | DrupalJsonApiParamsInterface) {
    this.initialize(input);
  }

  /**
   * Add custom parameter to the query.
   *
   * E.g. usage
   *
   * ```js
   * apiParams
   *   // To add `foo=bar` to the query.
   *   .addCustomParam({foo: 'bar'})
   *   // To add `foo[bar]=baz` to the query.
   *   .addCustomParam({ foo: {bar: 'baz'}})
   *   // To add `bar[0]=a&bar[1]=b&bar[2]=c` to the query.
   *   .addCustomParam({ bar: ['a', 'b', 'c']})
   * ```
   *
   * @param input The parameter object
   *
   * @category Helper
   */
  public addCustomParam(input: ParamBag<any>) {
    this.data = {
      ...this.data,
      ...input,
    };
  }

  /**
   * Add JSON:API field.
   *
   * The name of this method might be miss leading. Use this to explicitely request for specific fields on an entity.
   *
   * @param type Resource type
   * @param fields Array of field names in the given resource type
   *
   * @category JSON:API Query
   */
  public addFields(type: string, fields: string[]): DrupalJsonApiParams {
    this.data.fields[type] = fields.join(',');
    return this;
  }

  /**
   * Add JSON:API sort.
   *
   * Used to return the list of items in specific order.
   *
   * [Read more about Sort in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/sorting)
   *
   * @param path A 'path' identifies a field on a resource
   * @param direction Sort direction `ASC` or `DESC`
   *
   * @category JSON:API Query
   */
  public addSort(path: string, direction?: string): DrupalJsonApiParams {
    let prefix = '';
    if (direction !== undefined && direction === 'DESC') {
      prefix = '-';
    }
    this.data.sort = this.data.sort.concat(prefix + path);
    return this;
  }

  /**
   * Add JSON:API page limit.
   *
   * Use to restrict max amount of items returned in the listing.
   * Using this for pagination is tricky, and make sure you read
   * the following document on Drupal.org to implement it correctly.
   *
   * [Read more about Pagination in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/pagination)
   *
   * @param limit Number of items to limit to
   *
   * @category JSON:API Query
   */
  public addPageLimit(limit: number): DrupalJsonApiParams {
    this.data.page = { limit };
    return this;
  }

  /**
   * Add JSON:API include.
   *
   * Used to add referenced resources inside same request.
   * Thereby preventing additional api calls.
   *
   * [Read more about Includes in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/includes)
   *
   * @param fields Array of field names
   *
   * @category JSON:API Query
   */
  public addInclude(fields: string[]): DrupalJsonApiParams {
    this.data.include = this.data.include.concat(fields);
    return this;
  }

  /**
   * Add JSON:API group.
   *
   * @param name Name of the group
   * @param conjunction All groups have conjunctions and a conjunction is either `AND` or `OR`.
   * @param memberOf Name of the group, this group belongs to
   *
   * @category JSON:API Query
   */
  public addGroup(name: string, conjunction: string = 'OR', memberOf?: string): DrupalJsonApiParams {
    this.data.filter[name] = {
      group: {
        conjunction,
        ...(memberOf !== undefined && { memberOf }),
      },
    };
    return this;
  }

  /**
   * Add JSON:API filter.
   *
   * Following values can be used for the operator. If none is provided, it assumes "`=`" by default.
   * ```
   *   '=', '<>',
   *   '>', '>=', '<', '<=',
   *   'STARTS_WITH', 'CONTAINS', 'ENDS_WITH',
   *   'IN', 'NOT IN',
   *   'BETWEEN', 'NOT BETWEEN',
   *   'IS NULL', 'IS NOT NULL'
   * ```
   *
   * **NOTE: Make sure you match the value supplied based on the operators used as per the table below**
   *
   * | Value Type | Operator | Comment |
   * | ---   | ---  | ---         |
   * | `string`     | `=`, `<>`, `>`, `>=`, `<`, `<=`, `STARTS_WITH`, `CONTAINS`, `ENDS_WITH` | |
   * | `string[]`    | `IN`, `NOT IN` | |
   * | `string[]` _size 2_ | `BETWEEN`, `NOT BETWEEN` | The first item is used for min (start of the range), and the second item is used for max (end of the range).
   * | `null`    | `IS NULL`, `IS NOT NULL` | Must use `null`
   *
   * [Read more about filter in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/filtering)
   *
   * @param path A 'path' identifies a field on a resource
   * @param value string[] | null` | A 'value' is the thing you compare against. For operators like "IN" which supports multiple parameters, you can supply an array.
   * @param operator An 'operator' is a method of comparison
   * @param memberOf Name of the group, the filter belongs to
   *
   * @category JSON:API Query
   */
  public addFilter(
    path: string,
    value: string | string[] | null,
    operator: string = '=',
    memberOf?: string,
  ): DrupalJsonApiParams {
    const name = this.getIndexId(this.data.filter, path);

    // Allow null values only for IS NULL and IS NOT NULL operators.
    if (value === null) {
      if (!(operator === 'IS NULL' || operator === 'IS NOT NULL')) {
        throw new TypeError(`Value cannot be null for the operator "${operator}"`);
      }
      this.data.filter[name] = {
        condition: {
          path,
          ...{ operator },
          ...(memberOf !== undefined && { memberOf }),
        },
      };
      return this;
    }

    if (Array.isArray(value)) {
      switch (operator) {
        case 'BETWEEN':
        case 'NOT BETWEEN':
          if (value.length !== 2) {
            throw new TypeError(`Value must consists of 2 items for the "${operator}"`);
          }
          break;
        case 'IN':
        case 'NOT IN':
          break;
        default:
          throw new TypeError(`Value cannot be an array for the operator "${operator}"`);
      }
      this.data.filter[name] = {
        condition: {
          path,
          value,
          ...{ operator },
          ...(memberOf !== undefined && { memberOf }),
        },
      };
      return this;
    }
    // Validate filter
    if (memberOf === undefined && path === name && this.data.filter[path] === undefined) {
      if (operator === '=') {
        this.data.filter[name] = value;
      } else {
        this.data.filter[name] = {
          value,
          operator,
        };
      }
      return this;
    }

    this.data.filter[name] = {
      condition: {
        path,
        value,
        ...(operator !== '=' && { operator }),
        ...(memberOf !== undefined && { memberOf }),
      },
    };

    return this;
  }

  /**
   * @ignore
   */
  private getIndexId(obj: any, proposedKey: string): string {
    let key: string;
    if (obj[proposedKey] === undefined) {
      key = proposedKey;
    } else {
      key = Object.keys(obj).length.toString();
    }
    return key;
  }

  /**
   * Get query object.
   *
   * @category Helper
   */
  public getQueryObject(): ParamBag<any> {
    const foo: ParamBag<any> = JSON.parse(JSON.stringify(this.data));
    if (!!this.data.include.length) {
      foo.include = this.data.include.join(',');
    }
    if (!!this.data.sort.length) {
      foo.sort = this.data.sort.join(',');
    }
    return foo;
  }

  /**
   * Get query string.
   *
   * @category Helper
   */
  public getQueryString(options?: object): string {
    const data = this.getQueryObject();
    return qs.stringify(data, options);
  }

  /**
   * Clear all parameters added so far.
   *
   * @category Helper
   */
  public clear() {
    this.data = {
      filter: {},
      include: [],
      page: undefined,
      sort: [],
      fields: {},
    };
    return this;
  }

  /**
   * Initialize with a previously stored query object.
   *
   * @category Init
   */
  public initializeWithQueryObject(input: any) {
    this.clear();
    const keys = Object.keys(input);
    keys.forEach(key => {
      switch (key) {
        case 'sort':
          if (input.sort.length) {
            this.data.sort = input.sort.split(',');
          }
          break;
        case 'include':
          if (input.include.length) {
            this.data.include = input.include.split(',');
          }
          break;
        default:
          this.data[key as keyof DrupalJsonApiParamsStore] = input[key];
      }
    });
    return this;
  }

  /**
   * Initialize with a previously stored query string.
   *
   * @category Init
   */
  public initializeWithQueryString(input: string) {
    this.clear();
    this.initializeWithQueryObject(qs.parse(input));
    return this;
  }

  /**
   * Clone a given DrupalJsonApiParam object.
   *
   * @category Helper
   */
  public clone(input: DrupalJsonApiParamsInterface) {
    const data = JSON.parse(JSON.stringify(input.getQueryObject()));
    this.initializeWithQueryObject(data);
    return this;
  }

  /**
   * Initialize with a previously stored query/object/query string.
   *
   * @category Init
   */
  public initialize(input?: string | object | DrupalJsonApiParamsInterface): DrupalJsonApiParams {
    if (input === undefined) {
      this.initializeWithQueryString('');
    } else if (typeof input === 'object') {
      try {
        // if the input has getQueryObject() we attempt to clone.
        (input as DrupalJsonApiParamsInterface).getQueryObject();
        this.clone(input as DrupalJsonApiParamsInterface);
      } catch (error) {
        // In any case if cloning failed, we attempt to initialize
        // with query object.
        this.initializeWithQueryObject(input);
      }
    } else {
      this.initializeWithQueryString(input);
    }
    return this;
  }
}
