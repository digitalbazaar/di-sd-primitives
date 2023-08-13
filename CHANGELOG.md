# @digitalbazaar/di-sd-primitives Changelog

## 3.0.0 - 2023-08-dd

### Changed
- **BREAKING**: Primitive functions have been reworked to be simpler by using
  skolemized JSON-LD instead of skolemizing N-Quads directly and applying
  framing. Selection is now performed using JSON pointers on skolemized
  JSON-LD to ensure blank node IDs are stable for canonicalization
  operations. Additionally `filterAndGroup` has been replaced with
  `canonicalizeAndGroup`, allowing arbitrary `groups` to be passed for
  multiple selections of canonical and skolemized + deskolemized N-Quads
  with stable blank node IDs.

## 2.0.1 - 2023-05-19

### Fixed
- Fix matching N-Quads bug.

## 2.0.0 - 2023-05-19

### Added
- Initial version.

## 1.0.0 - 2023-05-19

- Never happened! This package started at 2.0.0.

