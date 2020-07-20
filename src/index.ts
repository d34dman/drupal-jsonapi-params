import qs = require('qs');
import Operators from './Operators.ts'

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

export class DrupalJsonApiParams {
  private filter: FilterItems = {};
  private sort: string[] = [];
  private include: string[] = [];
  private page: PageItem | undefined = undefined;
  private fields: FieldItems = {};

  public addFields(type: string, fields: string[]): DrupalJsonApiParams {
    this.fields[type] = fields.join(',');
    return this;
  }

  public addSort(path: string, direction?: string): DrupalJsonApiParams {
    let prefix = '';
    if (direction !== undefined && direction === 'DESC') {
      prefix = '-';
    }
    this.sort = this.sort.concat(prefix + path);
    return this;
  }

  public addPageLimit(limit: number): DrupalJsonApiParams {
    this.page = { limit };
    return this;
  }

  public addInclude(fields: string[]): DrupalJsonApiParams {
    this.include = this.include.concat(fields);
    return this;
  }

  public addGroup(name: string, conjunction: string = 'OR', memberOf?: string): DrupalJsonApiParams {
    this.filter[name] = {
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
    const name = this.getIndexId(this.filter, path);

    // Allow null values only for IS NULL and IS NOT NULL operators.
    if (value === null) {
      if (!(operator === 'IS NULL' || operator === 'IS NOT NULL')) {
        throw new TypeError(`Value cannot be null for the operator "${operator}"`);
      }
      this.filter[name] = {
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
      this.filter[name] = {
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
    if (operator === '=' && memberOf === undefined && this.filter[path] === undefined) {
      this.filter[path] = value;
      return this;
    }

    this.filter[name] = {
      condition: {
        path,
        value,
        ...(operator !== '=' && { operator }),
        ...(memberOf !== undefined && { memberOf }),
      },
    };

    return this;
  }
  
  public addFilterQuery(query: string): DrupalJsonApiParams {
    const operators = Object.values(Operators).join('|');
    const re = new RegExp(`(?<path>.+)\s*(?<operator>${operators})\s*'(?<value>.+)'\s*((memberOf)\s*(?<memberOf>.+))?`);
    const matches = query.match(re);
    let { path, operator, value, memberOf } = matches.groups;
    value = JSON.parse(value);
    memberOf = memberOf ? [memberOf] : []; 
    const params = [path, operator, value, ...memberOf];
    return this.addFilter(...params);
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
      ...(this.filter !== {} && { filter: this.filter }),
      ...(!!this.include.length && { include: this.include.join(',') }),
      ...(this.page !== undefined && { page: this.page }),
      ...(!!this.sort.length && { sort: this.sort.join(',') }),
      ...(this.fields !== {} && { fields: this.fields }),
    };
    return data;
  }

  public getQueryString(): string {
    const data = this.getQueryObject();
    return qs.stringify(data);
  }
}
