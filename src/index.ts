import qs = require('qs');

interface FilterItems {
  [key: string]: FilterItem | string;
}

interface FilterItem {
  condition?: {
    operator?: string;
    path: string;
    value?: string | string[];
    memberOf?: string;
  };
  group?: GroupItem;
}

interface GroupItem {
  conjunction: string;
  memberOf?: string;
}

interface PageItem {
  limit: number;
}

interface FieldItems {
  [key: string]: string;
}

interface DrupalJsonApiParamsStore {
  filter: FilterItems;
  sort: string[];
  include: string[];
  page: PageItem | undefined;
  fields: FieldItems;
}

interface ParamBag<TValue> {
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

  public addCustomParam(input: ParamBag<any>) {
    this.data = {
      ...this.data,
      ...input,
    };
  }

  public addFields(type: string, fields: string[]): DrupalJsonApiParams {
    this.data.fields[type] = fields.join(',');
    return this;
  }

  public addSort(path: string, direction?: string): DrupalJsonApiParams {
    let prefix = '';
    if (direction !== undefined && direction === 'DESC') {
      prefix = '-';
    }
    this.data.sort = this.data.sort.concat(prefix + path);
    return this;
  }

  public addPageLimit(limit: number): DrupalJsonApiParams {
    this.data.page = { limit };
    return this;
  }

  public addInclude(fields: string[]): DrupalJsonApiParams {
    this.data.include = this.data.include.concat(fields);
    return this;
  }

  public addGroup(name: string, conjunction: string = 'OR', memberOf?: string): DrupalJsonApiParams {
    this.data.filter[name] = {
      group: {
        conjunction,
        ...(memberOf !== undefined && { memberOf }),
      },
    };
    return this;
  }

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
    if (operator === '=' && memberOf === undefined && this.data.filter[path] === undefined) {
      this.data.filter[path] = value;
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

  private getIndexId(obj: any, proposedKey: string): string {
    let key: string;
    if (obj[proposedKey] === undefined) {
      key = proposedKey;
    } else {
      key = Object.keys(obj).length.toString();
    }
    return key;
  }

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

  public getQueryString(options?: object): string {
    const data = this.getQueryObject();
    return qs.stringify(data, options);
  }

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

  public initializeWithQueryString(input: string) {
    this.clear();
    this.initializeWithQueryObject(qs.parse(input));
    return this;
  }

  public clone(input: DrupalJsonApiParamsInterface) {
    const data = JSON.parse(JSON.stringify(input.getQueryObject()));
    this.initializeWithQueryObject(data);
    return this;
  }

  public initialize(
    input?: string | object | DrupalJsonApiParamsInterface
  ): DrupalJsonApiParams {
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
