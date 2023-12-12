/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';
import {klona} from 'klona';

import * as primitives from '../lib/index.js';
import {
  dlCredential,
  dlCredentialNoIds
} from './mock-data.js';
import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('select()', () => {
  it('should select JSON-LD matching N JSON pointers w/ IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      result = await primitives.selectJsonLd(
        {document: dlCredential, pointers});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expected = {
      '@context': dlCredential['@context'],
      id: dlCredential.id,
      type: dlCredential.type,
      credentialSubject: {
        id: dlCredential.credentialSubject.id,
        driverLicense: {
          type: dlCredential.credentialSubject.driverLicense.type,
          dateOfBirth:
            dlCredential.credentialSubject.driverLicense.dateOfBirth,
          expirationDate:
            dlCredential.credentialSubject.driverLicense.expirationDate
        }
      }
    };
    result.should.deep.equal(expected);
  });

  it('should select JSON-LD matching N JSON pointers w/o IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      result = await primitives.selectJsonLd(
        {document: dlCredentialNoIds, pointers});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expected = {
      '@context': dlCredentialNoIds['@context'],
      type: dlCredentialNoIds.type,
      credentialSubject: {
        driverLicense: {
          type: dlCredentialNoIds.credentialSubject.driverLicense.type,
          dateOfBirth:
            dlCredentialNoIds.credentialSubject.driverLicense.dateOfBirth,
          expirationDate:
            dlCredential.credentialSubject.driverLicense.expirationDate
        }
      }
    };
    result.should.deep.equal(expected);
  });

  it('should select N-Quads matching N JSON pointers w/ IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      // skolemize input
      const options = {documentLoader};
      const skolemized = await primitives.skolemizeCompactJsonLd(
        {document: dlCredential, options});

      // canonicalize deskolemized data to get stable label map
      const deskolemized = await primitives.toDeskolemizedNQuads(
        {document: skolemized.expanded, options});
      let canonicalIdMap = new Map();
      await primitives.canonicalize(
        deskolemized.join(''),
        {...options, inputFormat: 'application/n-quads', canonicalIdMap});
      // implementation-specific bnode prefix fix
      canonicalIdMap = primitives.stripBlankNodePrefixes(canonicalIdMap);

      // select from skolemized compact JSON-LD
      result = await primitives.selectCanonicalNQuads({
        document: skolemized.compact, pointers,
        labelMap: canonicalIdMap, options
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    result.should.have.keys(['selection', 'deskolemizedNQuads', 'nquads']);

    /* eslint-disable max-len */
    /* eslint-disable quotes */
    const expected = [
      "<urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440> <urn:example:driverLicense> _:c14n0 .\n",
      "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n",
      "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n",
      "<urn:uuid:36245ee9-9074-4b05-a777-febff2e69757> <https://www.w3.org/2018/credentials#credentialSubject> <urn:uuid:1a0e4ef5-091f-4060-842e-18e519ab9440> .\n",
      "_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n",
      "_:c14n0 <urn:example:dateOfBirth> \"01-01-1990\" .\n",
      "_:c14n0 <urn:example:expiration> \"01-01-2030\" .\n"
    ];
    /* eslint-enable max-len */
    /* eslint-enable quotes */
    result.nquads.sort().should.deep.equal(expected);
  });

  it('should select N-Quads matching N JSON pointers w/o IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      // skolemize input
      const options = {documentLoader};
      const skolemized = await primitives.skolemizeCompactJsonLd(
        {document: dlCredentialNoIds, options});

      // canonicalize deskolemized data to get stable label map
      const deskolemized = await primitives.toDeskolemizedNQuads(
        {document: skolemized.expanded, options});
      let canonicalIdMap = new Map();
      await primitives.canonicalize(
        deskolemized.join(''),
        {...options, inputFormat: 'application/n-quads', canonicalIdMap});
      // implementation-specific bnode prefix fix
      canonicalIdMap = primitives.stripBlankNodePrefixes(canonicalIdMap);

      // select from skolemized compact JSON-LD
      result = await primitives.selectCanonicalNQuads({
        document: skolemized.compact, pointers,
        labelMap: canonicalIdMap, options
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    result.should.have.keys(['selection', 'deskolemizedNQuads', 'nquads']);

    /* eslint-disable max-len */
    const expected = [
      '_:c14n0 <urn:example:driverLicense> _:c14n1 .\n',
      '_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n',
      '_:c14n1 <urn:example:dateOfBirth> "01-01-1990" .\n',
      '_:c14n1 <urn:example:expiration> "01-01-2030" .\n',
      '_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n',
      '_:c14n2 <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0 .\n'
    ];
    /* eslint-enable max-len */
    result.nquads.sort().should.deep.equal(expected);
  });

  it('should select N-Quads w/existing blank node IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/id',
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      // skolemize input
      const options = {documentLoader};
      const document = klona(dlCredentialNoIds);
      document.credentialSubject.driverLicense.id = '_:b123';
      const skolemized = await primitives.skolemizeCompactJsonLd(
        {document, options});

      // canonicalize deskolemized data to get stable label map
      const deskolemized = await primitives.toDeskolemizedNQuads(
        {document: skolemized.expanded, options});
      // ensure blank node ID is preserved
      deskolemized.join('').includes('<urn:example:driverLicense> _:b123 .\n')
        .should.equal(true);

      let canonicalIdMap = new Map();
      await primitives.canonicalize(
        deskolemized.join(''),
        {...options, inputFormat: 'application/n-quads', canonicalIdMap});
      // implementation-specific bnode prefix fix
      canonicalIdMap = primitives.stripBlankNodePrefixes(canonicalIdMap);

      // select from skolemized compact JSON-LD
      result = await primitives.selectCanonicalNQuads({
        document: skolemized.compact, pointers,
        labelMap: canonicalIdMap, options
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    result.should.have.keys(['selection', 'deskolemizedNQuads', 'nquads']);

    /* eslint-disable max-len */
    const expected = [
      '_:c14n0 <urn:example:driverLicense> _:c14n1 .\n',
      '_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicense> .\n',
      '_:c14n1 <urn:example:dateOfBirth> "01-01-1990" .\n',
      '_:c14n1 <urn:example:expiration> "01-01-2030" .\n',
      '_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .\n',
      '_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <urn:example:DriverLicenseCredential> .\n',
      '_:c14n2 <https://www.w3.org/2018/credentials#credentialSubject> _:c14n0 .\n'
    ];
    /* eslint-enable max-len */
    result.nquads.sort().should.deep.equal(expected);
  });
});
