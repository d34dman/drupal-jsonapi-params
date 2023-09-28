# Changelog

## 2.3.0

### Minor Changes

- 1edf445: Introduce configurations to control query generation behaviour.
- 1edf445: addFilter now supports an optional parameter to use a specific key

### Patch Changes

- Use TypeScript "this" return type for fluent setters

## 2.2.0

### Minor Changes

- c81d8ff: Introduced `setQsOption` and `getQsOption` to set and get default options passed to `qs` library.

### Patch Changes

- 8806a73: Switched primary development branch to use `main` instead of `master`
- 6f42bd0: Fixed a bug when non null values were supplied to `IS NULL` and `IS NOT NULL` operator, which used to generate buggy query.

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
