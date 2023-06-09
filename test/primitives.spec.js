/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as primitives from '../lib/index.js';

describe('exports', () => {
  it('it should have proper exports', async () => {
    should.exist(primitives);
    primitives.deskolemize.should.be.a('function');
    primitives.filterAndGroup.should.be.a('function');
    primitives.group.should.be.a('function');
    primitives.hashMandatory.should.be.a('function');
    primitives.hmacIdCanonize.should.be.a('function');
    primitives.skolemize.should.be.a('function');
    primitives.toDeskolemizedRDF.should.be.a('function');
  });
});
