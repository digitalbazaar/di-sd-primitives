/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';

import * as primitives from '../lib/index.js';
import {
  alumniCredential,
  dlCredential,
  dlCredentialNoIds,
  FRAME_FLAGS
} from './mock-data.js';
import jsonld from 'jsonld';
import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('pointersToFrames()', () => {
  it('should convert one JSON pointer w/ types', async () => {
    const pointer = '/credentialSubject/id';

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames(
        {document: alumniCredential, pointers: [pointer]});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
      '@context': alumniCredential['@context'],
      id: alumniCredential.id,
      type: alumniCredential.type,
      credentialSubject: {
        id: alumniCredential.credentialSubject.id
      }
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should convert one JSON pointer w/o types', async () => {
    const pointer = '/credentialSubject/id';

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames({
        document: alumniCredential, pointers: [pointer],
        includeTypes: false
      });
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
      '@context': alumniCredential['@context'],
      id: alumniCredential.id,
      credentialSubject: {
        id: alumniCredential.credentialSubject.id
      }
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should convert one nested JSON pointer w/ IDs', async () => {
    const pointer = '/credentialSubject/driverLicense/dateOfBirth';

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames(
        {document: dlCredential, pointers: [pointer]});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
      '@context': dlCredential['@context'],
      id: dlCredential.id,
      type: dlCredential.type,
      credentialSubject: {
        id: dlCredential.credentialSubject.id,
        driverLicense: {
          type: dlCredential.credentialSubject.driverLicense.type,
          dateOfBirth:
            dlCredential.credentialSubject.driverLicense.dateOfBirth
        }
      }
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should convert one nested JSON pointer w/o IDs', async () => {
    const pointer = '/credentialSubject/driverLicense/dateOfBirth';

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames(
        {document: dlCredentialNoIds, pointers: [pointer]});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
      '@context': dlCredentialNoIds['@context'],
      type: dlCredentialNoIds.type,
      credentialSubject: {
        driverLicense: {
          type: dlCredentialNoIds.credentialSubject.driverLicense.type,
          dateOfBirth:
          dlCredentialNoIds.credentialSubject.driverLicense.dateOfBirth
        }
      }
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should convert N JSON pointers w/ IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames(
        {document: dlCredential, pointers});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
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
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should convert N JSON pointers w/o IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      result = await primitives.pointersToFrames(
        {document: dlCredentialNoIds, pointers});
    } catch(e) {
      error = e;
    }
    expect(error).to.not.exist;
    expect(result).to.exist;

    const expectedFrames = [{
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
    }];
    result.should.deep.equal(expectedFrames);
  });

  it('should select data matching N JSON pointers w/ IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      const frames = await primitives.pointersToFrames(
        {document: dlCredential, pointers});
      frames.length.should.equal(1);
      const options = {...FRAME_FLAGS, safe: true, documentLoader};
      result = await jsonld.frame(dlCredential, frames[0], options);
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

  it('should select data matching N JSON pointers w/o IDs', async () => {
    const pointers = [
      '/credentialSubject/driverLicense/dateOfBirth',
      '/credentialSubject/driverLicense/expirationDate'
    ];

    let result;
    let error;
    try {
      const frames = await primitives.pointersToFrames(
        {document: dlCredentialNoIds, pointers});
      frames.length.should.equal(1);
      const options = {...FRAME_FLAGS, safe: true, documentLoader};
      result = await jsonld.frame(dlCredentialNoIds, frames[0], options);
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
});
