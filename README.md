# Drupal JSON-API Params

[![Build Status](https://travis-ci.org/d34dman/drupal-jsonapi-params.svg?branch=master)](https://travis-ci.org/d34dman/drupal-jsonapi-params)
[![codecov](https://codecov.io/gh/d34dman/drupal-jsonapi-params/branch/master/graph/badge.svg)](https://codecov.io/gh/d34dman/drupal-jsonapi-params)
![npm](https://img.shields.io/npm/v/drupal-jsonapi-params)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/drupal-jsonapi-params)
![npm type definitions](https://img.shields.io/npm/types/drupal-jsonapi-params)

The [JSON:API](https://jsonapi.org/) is now part of [Drupal](https://www.drupal.org/) Core.

The JSON:API specifications defines standard query parameters to be used to do filtering, sorting, restricting fields that are returned, pagination and so on.

This module provides a helper Class to create the required query. While doing so, it also tries to optimise the query by using the short form, whenever possible.

## Installation

Install the package via `npm`:

```sh
$ npm i drupal-jsonapi-params
```

## Usage

### import

Import `DrupalJsonApiParams` from `drupal-jsonapi-params/lib`
```js
import {DrupalJsonApiParams} from 'drupal-jsonapi-params/lib';

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
  // Add Fields.
  .addFields('node--article', ['field_a.id', 'field_b.uid', 'field_c.tid'])
  // Add Includes.
  .addInclude(['field_a.id', 'field_b.uid', 'field_c.tid'])
  // Add multiple sort criterion.
  .addSort('id', 'DESC')
  .addSort('uid')
  .addSort('status');

const urlencodedQueryString = apiParams.getQueryString();

```

## API

### getQueryString

Returns urlencoded query string which can be used in api calls.

### addFilter

Used to restrict items returned in a listing.

| Params | Type | Description |
| ---   | ---  | ---         |
| path     | `string` | A 'path' identifies a field on a resource
| value    | `string|string[]` | A 'value' is the thing you compare against. For operators like "IN" which supports multiple parameters, you can supply an array.
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

### addFields

The name of this method might be miss leading. Use this to explicitely request for specific fields on an entity.

|Params | Type | Description |
| ---   | ---  | ---         |
| type   | `string`   | Resource type
| fields | ``string[]`` | Array of field names in the given resource type
