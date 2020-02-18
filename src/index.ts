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
  private sort: Object = {};
  private fields: Object = {};
  private page: Object = {};

  public addFilter(
    path: string,
    value: string,
    operator: string = '=',
    group: string | undefined = undefined,
  ): DrupalJsonApiParams {
    if (operator === '=' && group === undefined && this.filter[path] === undefined) {
      this.filter[path] = value;
      return this;
    }

    var name = this.getIndexId(this.filter, path);

    this.filter[name] = {
      condition: {
        path: path,
        value: value,
        ...(operator !== '=' && { operator: operator }),
        ...(group !== undefined && { group: group }),
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
    let data = {
      filter: this.filter,
    };
    return qs.stringify(data);
  }
}
