import qs = require('qs');

interface FilterItems {
  [key: string]: FilterItem | string;
}

interface FilterItem {
  condition: {
    operator?: string;
    group?: string;
    path: string;
    value: string;
  };
}

interface GroupItems {
  [key: string]: GroupItem;
}
interface GroupItem {
  conjunction: string;
  memberOf?: string;
}

interface PageItem {
  limit:number;
}

interface FieldItems {
  [key: string]: string;
}

export class DrupalJsonApiParams {
  private filter: FilterItems = {};
  private group: GroupItems = {};
  private sort: string[] = [];
  private include: string[] = [];
  private page: PageItem|undefined = undefined;
  private fields: FieldItems = {};

  // restrictFieldsByType (type, ...fields) {
  //   this.data.fields[type] = fields.join(',')
  //   return this
  // }
  public addFields(type:string, fields: string[]): DrupalJsonApiParams {
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

  public addPageLimit(limit:number) : DrupalJsonApiParams {
    this.page = { limit };
    return this;
  }

  public addInclude(fields:string[]): DrupalJsonApiParams {
    this.include = this.include.concat(fields);
    return this;
  }

  public addGroup(name: string, conjunction: string = 'OR', memberOf?: string): DrupalJsonApiParams {
    this.group[name] = {
      conjunction,
      ...(memberOf !== undefined && {memberOf}),
    };
    return this;
  }

  public addFilter(path: string, value: string, operator: string = '=', group?: string): DrupalJsonApiParams {
    if (operator === '=' && group === undefined && this.filter[path] === undefined) {
      this.filter[path] = value;
      return this;
    }

    const name = this.getIndexId(this.filter, path);

    this.filter[name] = {
      condition: {
        path,
        value,
        ...(operator !== '=' && { operator }),
        ...(group !== undefined && { group }),
      },
    };

    return this;
  }

  getIndexId(obj: any, proposedKey: string): string {
    let key: string;
    if (obj[proposedKey] === undefined) {
      key = proposedKey;
    } else {
      key = Object.keys(obj).length.toString();
    }
    return key;
  }

  public getQueryString(): string {
    const data = {
      ...(this.filter !== {} && {filter: this.filter}),
      ...(this.group !== {} && {group: this.group}),
      ...(!!this.include.length && {include: this.include.join(',')}),
      ...(this.page !== undefined && {page: this.page}),
      ...(!!this.sort.length && {sort: this.sort.join(',')}),
      ...(this.fields !== {} && {fields: this.fields}),
    };
    return qs.stringify(data);
  }
}
