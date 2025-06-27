# Changelog

## 3.0.0

### Major Changes

- - **BREAKING CHANGE**: Changed internal properties and methods from `private` to `protected` to enable inheritance scenarios
    - `data` property is now accessible to subclasses for query state management
    - `qsOptions` property is now accessible to subclasses for query string options
    - `config` property is now accessible to subclasses for configuration settings
    - `generateKeyName` method is now accessible to subclasses
    - `getIndexId` method is now accessible to subclasses
    - This change affects consumers who subclass `DrupalJsonApiParams`

## 2.3.2

### Patch Changes

- Fixed return for custom params method [#44](https://github.com/d34dman/drupal-jsonapi-params/pull/44).

## 2.3.1

### Patch Changes

- Dev dependency update.

## 2.3.0

### Minor Changes

- Introduce configurations to control query generation behaviour.
- `addFilter` now supports an optional parameter to use a specific key

### Patch Changes

- Use TypeScript `this` return type for fluent setters

## 2.2.0

### Minor Changes

- Introduced `setQsOption` and `getQsOption` to set and get default options passed to `qs` library.

### Patch Changes

- Switched primary development branch to use `main` instead of `master`
- Fixed a bug when non null values were supplied to `IS NULL` and `IS NOT NULL` operator, which used to generate buggy query.

## [2.1.0]

- `addPageOffset` method added.

## [2.0.0]

## Changed

- BREAKING CHANGE! FilterItem interface has been replaced by FilterItemType

## Fixed

- Fixed short query generation for cases where operator is other than "="

## [1.2.3]

### Changed

- Switched to version 2 for package-lock.json
- Updated testing tools (jest) from 25._ to 27._

## [1.2.2] - 2021-06-14

### Added

- Added CHANGELOG.md

### Changed

- `constructor` for `DrupalJsonApiParams` accepts same parameter as `initialize` method, and also calls it.
