import qs = require('qs')

export class DrupalJsonApiParams {

  greeting: string;
 
  constructor (message: string) {
    this.greeting = message;
  }

  public greet() {
    return "Hello, " + this.greeting;
  }
}
