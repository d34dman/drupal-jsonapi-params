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

export class DrupalJsonApiParams {
  private filter: FilterItems = {};
  private group: GroupItems = {};
  private include: string[] = []; 

  public addInclude(...fields:string[]): DrupalJsonApiParams {
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
    };
    return qs.stringify(data);
  }
}
