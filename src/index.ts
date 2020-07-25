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

export class DrupalJsonApiParams {
  private data: DrupalJsonApiParamsStore = {
    filter: {},
    sort: [],
    include: [],
    page: undefined,
    fields: {},
  }; 

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
      if (!(operator === 'BETWEEN' || operator === 'NOT BETWEEN')) {
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

  public getQueryObject(): object {
    const data = {
      ...(this.data.filter !== {} && { filter: this.data.filter }),
      ...(!!this.data.include.length && { include: this.data.include.join(',') }),
      ...(this.data.page !== undefined && { page: this.data.page }),
      ...(!!this.data.sort.length && { sort: this.data.sort.join(',') }),
      ...(this.data.fields !== {} && { fields: this.data.fields }),
    };
    return data;
  }

  public getQueryString(): string {
    const data = this.getQueryObject();
    return qs.stringify(data);
  }

  public clear() {
    this.data = {
      filter: {},
      sort: [],
      include: [],
      page: undefined,
      fields: {},
    };
    return this;
  }
  
  public initializeWithQueryObject(input: any) {
    this.clear();
    if (input.filter !== undefined) {
      this.data.filter = input.filter;
    }
    if (input.include !== undefined) {
      this.data.include = input.include.split(',');
    }
    if (input.page !== undefined) {
      this.data.page = input.page;
    }
    if (input.sort !== undefined) {
      this.data.sort = input.sort.split(',');
    }
    if (input.fields !== undefined) {
      this.data.fields = input.fields;
    }
    return this;
  }

  public initializeWithQueryString(input: string) {
    this.clear();
    this.initializeWithQueryObject(qs.parse(input));
  }

}
