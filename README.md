# Data Integrity Selective Disclosure Primitives _(@digitalbazaar/di-sd-primitives)_

[![Build status](https://img.shields.io/github/workflow/status/digitalbazaar/di-sd-primitives/Node.js%20CI)](https://github.com/digitalbazaar/di-sd-primitives/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/di-sd-primitives)](https://codecov.io/gh/digitalbazaar/di-sd-primitives)
[![NPM Version](https://img.shields.io/npm/v/@digitalbazaar/di-sd-primitives.svg)](https://npm.im/@digitalbazaar/di-sd-primitives)

> Data Integrity Selective Disclosure Primitives for use with Data Integrity
selective disclosure cryptosuites and jsonld-signatures.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

For use with https://github.com/digitalbazaar/jsonld-signatures v11.2 and above.

See also related specs:

* [Verifiable Credential Data Integrity](https://w3c.github.io/vc-data-integrity/)

## Security

TBD

## Install

- Browsers and Node.js 16+ are supported.

To install from NPM:

```
npm install @digitalbazaar/di-sd-primitives
```

To install locally (for development):

```
git clone https://github.com/digitalbazaar/di-sd-primitives.git
cd di-sd-primitives
npm install
```

## Usage

The following code snippet provides a complete example of digitally signing
a verifiable credential using this library:

```javascript
import * as primitives from '@digitalbazaar/di-sd-primitives';

// canonize a document (e.g., Verifiable Credential (VC)) and replace blank
// node IDs that are informationally decoupled from the data in the document
const hmac = await primitives.createHmac({key: hmacKey});
const result = await primitives.hmacIdCanonize(
  {document: credential, options: {documentLoader}, hmac});

// canonize a document (e.g., VC) and replace blank node IDs with any
// values; most useful for verifiers to use a label map provided in a
// selectively disclosed proof (verifiers do not get the HMAC key, so they
// cannot generate *any* HMAC'd ID, they only get the disclosed labels)
const labelMap = new Map([
  ['c14n0', 'uSomeBase64UrlHMACDigest1'],
  ['c14n1', 'uSomeBase64UrlHMACDigest2'],
  ['c14n2', 'uSomeBase64UrlHMACDigest3']
]);
const result = await primitives.hmacIdCanonize(
  {document: credential, options: {documentLoader}, labelMap});

// convert JSON pointers to a JSON-LD frame that can be used to select
// data from a document (e.g., VC)
const pointers = [
  '/credentialSubject/driverLicense/dateOfBirth',
  '/credentialSubject/driverLicense/expirationDate'
];
const result = await primitives.pointersToFrame(
  {document: credential, pointers});
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/di-sd-primitives/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © 2023 Digital Bazaar
