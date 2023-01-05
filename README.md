# Drupal JSON-API Params

![GitHub pages build status](https://img.shields.io/github/actions/workflow/status/d34dman/drupal-jsonapi-params/typedoc.yml?style=flat-square&label=Build)
![codecov](https://img.shields.io/codecov/c/github/d34dman/drupal-jsonapi-params/main?style=flat-square)
[![npm](https://img.shields.io/npm/v/drupal-jsonapi-params?style=flat-square)](https://www.npmjs.com/package/drupal-jsonapi-params)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/drupal-jsonapi-params?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/drupal-jsonapi-params?style=flat-square)
[![npm downloads](https://img.shields.io/npm/dt/drupal-jsonapi-params.svg?maxAge=2592000&style=flat-square)](http://npmjs.com/package/drupal-jsonapi-params)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/d34dman/drupal-jsonapi-params?style=flat-square)](https://snyk.io/test/npm/drupal-jsonapi-params)

The [JSON:API](https://jsonapi.org/) is part of [Drupal](https://www.drupal.org/) Core.

The JSON:API specifications defines standard query parameters to be used to do filtering, sorting, restricting fields that are returned, pagination and so on.

This module provides a helper Class to create the required query. While doing so, it also tries to optimise the query by using the short form, whenever possible.

  [![API Reference](https://img.shields.io/github/actions/workflow/status/d34dman/drupal-jsonapi-params/typedoc.yml?label=API%20Reference&logo=GitHub&style=for-the-badge)](https://d34dman.github.io/drupal-jsonapi-params/)
## Installation

Install the package via `npm`:

```sh
$ npm i drupal-jsonapi-params
```

## Usage

### import

Import `DrupalJsonApiParams` from `drupal-jsonapi-params`
```js
import {DrupalJsonApiParams} from 'drupal-jsonapi-params';

const apiParams = new DrupalJsonApiParams();
```

### require

```js
var drupalJsonapiParams = require("drupal-jsonapi-params")

const apiParams = new drupalJsonapiParams.DrupalJsonApiParams();
```

```js
apiParams
  // Add Group within Groups.
  .addGroup('publish_status', 'OR', 'parent_group')
  .addGroup('child_group_B', 'AND', 'parent_group')
  .addGroup('parent_group', 'AND')
  // Add Filters.
  .addFilter('status', '1')
  // Add Filter to Group.
  .addFilter('status', '2', '!=', 'publish_status')
  // Add Page Limit.
  .addPageLimit(5)
  // Add Page Offset.
  .addPageOffset(20)
  // Add Fields.
  .addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid'])
  // Add Includes.
  .addInclude(['field_a.id', 'field_b.uid', 'field_c.tid'])
  // Add multiple sort criterion.
  .addSort('id', 'DESC')
  .addSort('uid')
  .addSort('status');

const urlencodedQueryString = apiParams.getQueryString();
const queryString = apiParams.getQueryString({ encode: false });

```

## API

### getQueryString [options?]

Returns query string which can be used in api calls. By default the output is URI encoded. Options can be passed to control the [qs.stringifying](https://github.com/ljharb/qs#stringifying) internally used.

### addFilter

Used to restrict items returned in a listing.

| Params | Type | Description |
| ---   | ---  | ---         |
| path     | `string` | A 'path' identifies a field on a resource
| value    | `string` | string[] | null` | A 'value' is the thing you compare against. For operators like "IN" which supports multiple parameters, you can supply an array.
| operator | `string` | (Optional) An 'operator' is a method of comparison 
| group    | `string` | (Optional) Name of the group, the filter belongs to


Following values can be used for the operator. If none is provided, it assumes "`=`" by default.

```
  '=', '<>',
  '>', '>=', '<', '<=',
  'STARTS_WITH', 'CONTAINS', 'ENDS_WITH',
  'IN', 'NOT IN',
  'BETWEEN', 'NOT BETWEEN',
  'IS NULL', 'IS NOT NULL'
```

**NOTE: Make sure you match the value supplied based on the operators used as per the table below**

| Value Type | Operator | Description |
| ---   | ---  | ---         |
| `string`     | `=`, `<>`, `>`, `>=`, `<`, `<=`, `STARTS_WITH`, `CONTAINS`, `ENDS_WITH` | |
| `string[]`    | `IN`, `NOT IN` | |
| `string[]` _size 2_ | `BETWEEN`, `NOT BETWEEN` | The first item is used for min (start of the range), and the second item is used for max (end of the range).
| `null`    | `IS NULL`, `IS NOT NULL` | Must use `null`


[Read more about filter in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/filtering)

### addGroup

Used to group Filters. Groups can be nested too.

|Params | Type | Description |
| ---   | ---  | ---         |
| name        | `string` | Name of the group
| conjunction | `string` | (Optional) All groups have conjunctions and a conjunction is either `AND` or `OR`.
| memberOf    | `string` | (Optional) Name of the group, this group belongs to

### addInclude

Used to add referenced resources inside same request. Thereby preventing additional api calls.

|Params | Type | Description |
| ---   | ---  | ---         |
| fields | `string[]` | Array of field names

[Read more about Includes in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/includes)

### addSort

Used to return the list of items in specific order.

|Params | Type | Description |
| ---   | ---  | ---         |
| path      | `string` | A 'path' identifies a field on a resource
| direction | `string` | Sort direction `ASC` or `DESC`

[Read more about Sort in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/sorting)

### addPageLimit

Use to restrict max amount of items returned in the listing. Using this for pagination is tricky, and make sure you read the following document on Drupal.org to implement it correctly.

|Params | Type | Description |
| ---   | ---  | ---         |
| limit | `number` | Number of items to limit to |

[Read more about Pagination in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/pagination)

### addPageOffset

Use to skip some items items from start of the listing. Please note that this is not the page number. To get the offset number for a page you can
multiply the number of pages you want to skip with items per page.

|Params | Type | Description |
| ---   | ---  | ---         |
| offset | `number` | Number of items to skip to |

[Read more about Pagination in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/pagination)

### addFields

The name of this method might be miss leading. Use this to explicitely request for specific fields on an entity.

|Params | Type | Description |
| ---   | ---  | ---         |
| type   | `string`   | Resource type
| fields | ``string[]`` | Array of field names in the given resource type

---
### addCustomParam

Use to add custom parameter to the query.

|Params | Type | Description |
| ---   | ---  | ---         |
| input | `object` | The parameter object |

E.g. usage

```js
apiParams
  // To add `foo=bar` to the query.
  .addCustomParam({foo: 'bar'})
  // To add `foo[bar]=baz` to the query.
  .addCustomParam({ foo: {bar: 'baz'}})
  // To add `bar[0]=a&bar[1]=b&bar[2]=c` to the query.
  .addCustomParam({ bar: ['a', 'b', 'c']})
```


## Helper methods

### clear

Clears all query parameter constructed so far.

### getQueryObject

Get object representation of the query object generated so far.

### initialize

Re-initialize with a query string/object or another instance of DrupalJsonApiParams

### initializeWithQueryObject

Re-initialize with previously stored data from `getQueryObject`

### initializeWithQueryString

Re-initialize with previously stored data from `getQueryString`.
This method accepts an optional parameter to pass options to `qs` library when parsing the given query.

Please refer to https://www.npmjs.com/package/qs for more info about available options.

This would override any options set using setQsOptions during the given call.

### setQsOption

Set options that is passed to `qs` library when parsing/serializing query paramters.
Please refer to https://www.npmjs.com/package/qs for more info about available options.

### getQsOption

Get options that is passed to qs library when parsing/serializing query paramters. The value should match whatever was previously set via `setQsOptions` method.
