/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as primitives from '../lib/index.js';

describe('exports', () => {
  it('it should have proper exports', async () => {
    should.exist(primitives);
    // skolemize
    primitives.deskolemizeNQuads.should.be.a('function');
    primitives.skolemizeCompactJsonLd.should.be.a('function');
    primitives.skolemizeExpandedJsonLd.should.be.a('function');
    primitives.skolemizeNQuads.should.be.a('function');
    primitives.toDeskolemizedNQuads.should.be.a('function');
    // canonicalize
    primitives.canonicalize.should.be.a('function');
    primitives.canonizeProof.should.be.a('function');
    primitives.createHmacIdLabelMapFunction.should.be.a('function');
    primitives.createLabelMapFunction.should.be.a('function');
    primitives.hashCanonizedProof.should.be.a('function');
    primitives.labelReplacementCanonicalizeJsonLd.should.be.a('function');
    primitives.labelReplacementCanonicalizeNQuads.should.be.a('function');
    primitives.relabelBlankNodes.should.be.a('function');
    primitives.stripBlankNodePrefixes.should.be.a('function');
    // group
    primitives.canonicalizeAndGroup.should.be.a('function');
    // hash
    primitives.createHasher.should.be.a('function');
    // hmac
    primitives.createHmac.should.be.a('function');
    // mandatory
    primitives.hashMandatory.should.be.a('function');
    // select
    primitives.selectJsonLd.should.be.a('function');
    primitives.selectCanonicalNQuads.should.be.a('function');
    // pointer
    primitives.parsePointer.should.be.a('function');
    // helpers
    primitives.stringToUtf8Bytes.should.be.a('function');
  });
});
