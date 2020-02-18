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

export class DrupalJsonApiParams {
  private filter: FilterItems = {};

  public addFilter(path: string, value: string, operator?: string = '=', group?: string): DrupalJsonApiParams {
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
      filter: this.filter,
    };
    return qs.stringify(data);
  }
}
