/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';

import * as primitives from '../lib/index.js';
import {
  alumniCredential,
  dlCredentialNoIds,
  hmacKey
} from './mock-data.js';
import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('labelReplacementCanonicalizeJsonLd()', () => {
  it('should HMAC ID canonize w/o blank nodes', async () => {
    let result;
    let error;
    try {
      const hmac = await primitives.createHmac({key: hmacKey});
      const labelMapFactoryFunction =
        primitives.createHmacIdLabelMapFunction({hmac});
      result = await primitives.labelReplacementCanonicalizeJsonLd({
        document: alumniCredential,
        labelMapFactoryFunction,
        options: {documentLoader}
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    /* eslint-disable max-len */
    const expectedResult = [
      '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:AlumniCredential> .\n',
      '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> .\n',
      '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuanceDate> "2010-01-01T19:23:24Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
      '<urn:uuid:98c5cffc-efa2-43e3-99f5-01e8ef404be0> <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n',
      '<urn:uuid:d58b2365-0951-4373-96c8-e886d61829f2> <https://schema.org#alumniOf> "Example University" .\n'
    ];
    /* eslint-enable max-len */
    result.should.deep.equal(expectedResult);
  });

  it('should HMAC ID canonize w/ labelMap w/ blank nodes', async () => {
    const labelMap = new Map([
      ['c14n0', 'c14n0_new'],
      ['c14n1', 'c14n2_new'],
      ['c14n2', 'c14n3_new']
    ]);

    let result;
    let error;
    try {
      const labelMapFactoryFunction =
        primitives.createLabelMapFunction({labelMap});
      result = await primitives.labelReplacementCanonicalizeJsonLd({
        document: dlCredentialNoIds,
        labelMapFactoryFunction,
        options: {documentLoader}
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    /* eslint-disable max-len */
    const expectedResult = [
      '_:c14n0_new <urn:example:driverLicense> _:c14n2_new .\n',
      '_:c14n2_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n',
      '_:c14n2_new <urn:example:dateOfBirth> \"01-01-1990\" .\n',
      '_:c14n2_new <urn:example:documentIdentifier> \"T21387yc328c7y32h23f23\" .\n',
      '_:c14n2_new <urn:example:expiration> \"01-01-2030\" .\n',
      '_:c14n2_new <urn:example:issuingAuthority> \"VA\" .\n',
      '_:c14n3_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '_:c14n3_new <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n',
      '_:c14n3_new <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0_new .\n',
      '_:c14n3_new <https://www.w3.org/2018/credentials#issuanceDate> \"2010-01-01T19:23:24Z\"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
      '_:c14n3_new <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n'
    ];
    /* eslint-enable max-len */
    result.should.deep.equal(expectedResult);
  });

  it('should HMAC ID canonize w/ hmac w/ blank nodes', async () => {
    let result;
    let error;
    try {
      const hmac = await primitives.createHmac({key: hmacKey});
      const labelMapFactoryFunction =
        primitives.createHmacIdLabelMapFunction({hmac});
      result = await primitives.labelReplacementCanonicalizeJsonLd({
        document: dlCredentialNoIds,
        labelMapFactoryFunction,
        options: {documentLoader}
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    /* eslint-disable max-len */
    const expectedResult = [
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#credentialSubject> _:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuanceDate> \"2010-01-01T19:23:24Z\"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n',
      '_:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 <urn:example:driverLicense> _:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:dateOfBirth> \"01-01-1990\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:documentIdentifier> \"T21387yc328c7y32h23f23\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:expiration> \"01-01-2030\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:issuingAuthority> \"VA\" .\n'
    ];
    /* eslint-enable max-len */
    result.should.deep.equal(expectedResult);
  });
});

describe('labelReplacementCanonicalizeNQuads()', () => {
  it('should HMAC ID canonize w/ hmac w/ blank nodes', async () => {
    let result;
    let error;
    try {
      const hmac = await primitives.createHmac({key: hmacKey});
      const labelMapFactoryFunction =
        primitives.createHmacIdLabelMapFunction({hmac});
      const options = {documentLoader};
      const skolemized = await primitives.skolemizeCompactJsonLd(
        {document: dlCredentialNoIds, options});
      // next a canonicalization operation is usually performed on the
      // expanded version and a selection operation is usually performed on
      // the compact version -- and then the two are checked for matching
      // N-Quads
      const deskolemized = await primitives.toDeskolemizedNQuads(
        {document: skolemized.compact, options});
      result = await primitives.labelReplacementCanonicalizeNQuads({
        nquads: deskolemized,
        labelMapFactoryFunction,
        options: {documentLoader}
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    result.should.have.keys(['nquads', 'labelMap']);

    /* eslint-disable max-len */
    const expectedResult = [
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#credentialSubject> _:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuanceDate> \"2010-01-01T19:23:24Z\"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n',
      '_:u5rPeKe9bxfq4XOZDtWBqQQ2gy3sljChtTwP7YuHAbRw <https://www.w3.org/2018/credentials#issuer> <did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9> .\n',
      '_:u60VTj_8ZrVXlgJhbS4QnqCkgd0zsmM7YL1K5sBYv6N4 <urn:example:driverLicense> _:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:dateOfBirth> \"01-01-1990\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:documentIdentifier> \"T21387yc328c7y32h23f23\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:expiration> \"01-01-2030\" .\n',
      '_:uXqefD0KC4zrzEbFJhvdhYTGzRYW3RhjcQvfkpkWqDpc <urn:example:issuingAuthority> \"VA\" .\n'
    ];
    /* eslint-enable max-len */
    result.nquads.should.deep.equal(expectedResult);
  });
});
