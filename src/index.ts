import qs = require('qs')

export class DrupalJsonApiParams {
 
  private filter:Object = {};
  private sort:Object = {};
  private fields:Object = {};
  private page:Object = {};


  getQueryString ():string {
    let data = {}
    return qs.stringify(data)
  }

}
