# Drupal JSON-API Params

[![Build Status](https://travis-ci.org/d34dman/drupal-jsonapi-params.svg?branch=master)](https://travis-ci.org/d34dman/drupal-jsonapi-params)
[![codecov](https://codecov.io/gh/d34dman/drupal-jsonapi-params/branch/master/graph/badge.svg)](https://codecov.io/gh/d34dman/drupal-jsonapi-params)
![npm](https://img.shields.io/npm/v/drupal-jsonapi-params)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/drupal-jsonapi-params)
![npm type definitions](https://img.shields.io/npm/types/drupal-jsonapi-params)

The [JSON:API](https://jsonapi.org/) is now part of [Drupal](https://www.drupal.org/) Core.

The JSON:API specifications defines standard query parameters to be used to do filtering, sorting, restring fields that are returned, pagination and so on.

This module provides a helper Class to create the required query.

## Installation

Install the package via `npm`:

```sh
$ npm i drupal-jsonapi-params
```

## Usage

Require and use `DrupalJsonApiParams` from `drupal-jsonapi-params/lib`

```js
import {DrupalJsonApiParams} from 'drupal-jsonapi-params/lib';

const apiParams = new DrupalJsonApiParams();

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

[Read more about filter in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/filtering)

### addGroup

Used to group Filters. Groups can be nested too.

### addInclude

Used to add referenced resources inside same request. Thereby preventing additional api calls.

[Read more about Includes in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/includes)

### addSort

Used to return the list of items in specific order.

[Read more about Sort in Drupal.org Documentation](https://www.drupal.org/docs/8/modules/jsonapi/sorting)

### addPageLimit

Use to restrict max amount of items returned in the listing. Using this for pagination is tricky, and make sure you read the following document on Drupal.org to implement it correctly.

[Read more about Pagination in Drupal.org Documentation](https://www.drupal.org/docs/8/core/modules/jsonapi-module/pagination)

### addFields

The name of this method might be miss leading. Use this to explicitely request for specific fields on an entity.
