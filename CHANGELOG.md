# @digitalbazaar/di-sd-primitives Changelog

## 3.3.0 - 2026-xx-xx

### Changed
- Replace `uuid` with `crypto.randomUUID()`.
- Update dev dependencies.
- **NOTE**: Update supported platforms.
  - Test on Node.js >=20.
  - Update `engines.node` to `>=20`.
  - Update README requirements section.

## 3.2.0 - 2026-02-05

### Changed
- Update dependencies:
  - `jsonld@9`.
  - `rdf-canonize@5`.
- **NOTE**: The `jsonld` update may have rare edge case compatibility issues.
  The important related `rdf-canonize` issues were addressed with the update in
  v3.0.4.

## 3.1.0 - 2024-11-25

### Added
- Add support for `@direction`.

## 3.0.4 - 2024-08-26

### Fixed
- Ensure latest `rdf-canonize` is used when canonicalizing.

## 3.0.3 - 2024-08-05

### Changed
- Update dependencies.
  - `jsonld@8.3.2`
  - `uuid@10`
- Update dev dependencies.

## 3.0.2 - 2024-08-01

### Changed
- Update to latest `rdf-canonize`. Update test deps.

## 3.0.1 - 2023-12-12

### Fixed
- Fix skolemization of existing blank node identifier.

## 3.0.0 - 2023-08-15

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
