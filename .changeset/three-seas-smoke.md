---
'drupal-jsonapi-params': patch
---

Fixed a bug when non null values were supplied to `IS NULL` and `IS NOT NULL` operator, generated wrong query.
