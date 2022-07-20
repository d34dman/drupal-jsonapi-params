# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0]

## New

- `addPageOffset` method added.

## [2.0.0]

## Changed

- BREAKING CHANGE! FilterItem interface has been replaced by FilterItemType

## Fixed

- Fixed short query generation for cases where operator is other than "="
## [1.2.3]
### Changed
- Switched to version 2 for package-lock.json
- Updated testing tools (jest) from 25.* to 27.*
## [1.2.2] - 2021-06-14
### Added
- Added CHANGELOG.md
### Changed
- `constructor` for `DrupalJsonApiParams` accepts same parameter as `initialize` method, and also calls it.
