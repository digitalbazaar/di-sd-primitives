/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import * as base64url from 'base64url-universal';
import {createHasher} from './hash.js';
import jsonld from 'jsonld';
import {stringToUtf8Bytes} from './helpers.js';

export async function labelReplacementCanonicalizeJsonLd({
  document, labelMapFactoryFunction, options
} = {}) {
  return _labelReplacementCanonicalizeNQuads(
    {document, labelMapFactoryFunction, options});
}

export async function labelReplacementCanonicalizeNQuads({
  nquads, labelMapFactoryFunction, options
} = {}) {
  return _labelReplacementCanonicalizeNQuads(
    {nquads, labelMapFactoryFunction, options});
}

export function relabelBlankNodes({nquads, labelMap} = {}) {
  const replacer = (m, s1, label) => '_:' + labelMap.get(label);
  return nquads.map(e => e.replace(/(_:([^\s]+))/g, replacer));
}

export function createHmacIdLabelMapFunction({hmac} = {}) {
  return async ({canonicalIdMap}) => {
    const bnodeIdMap = new Map();
    for(const [input, c14nLabel] of canonicalIdMap) {
      const utf8Bytes = stringToUtf8Bytes(c14nLabel);
      const hashed = await hmac.sign(utf8Bytes);
      // multibase prefix of `u` is important to make bnode ID syntax-legal
      // see: https://www.w3.org/TR/n-quads/#BNodes
      bnodeIdMap.set(input, `u${base64url.encode(hashed)}`);
    }
    return bnodeIdMap;
  };
}

export function createLabelMapFunction({labelMap} = {}) {
  return async ({canonicalIdMap}) => {
    const bnodeIdMap = new Map();
    for(const [input, c14nLabel] of canonicalIdMap) {
      bnodeIdMap.set(input, labelMap.get(c14nLabel));
    }
    return bnodeIdMap;
  };
}

export async function canonicalize(input, options) {
  if(!(options && typeof options === 'object')) {
    throw new TypeError('"options" must be an object.');
  }
  return jsonld.canonize(input, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads',
    ...options
  });
}

export async function canonizeProof({document, proof, options} = {}) {
  proof = {
    '@context': document['@context'],
    ...proof
  };
  delete proof.proofValue;
  return canonicalize(proof, options);
}

export async function hashCanonizedProof({
  document, proof, options, hasher
} = {}) {
  if(!hasher) {
    // create default `hasher` if not specified
    hasher = createHasher();
  }
  const canonized = await canonizeProof({document, proof, options});
  return hasher.hash(stringToUtf8Bytes(canonized));
}

// utility function for use with implementations do not do strip `_:` prefixes
export function stripBlankNodePrefixes(map) {
  let checked = false;
  const stripped = new Map();
  for(const [key, value] of map) {
    if(!checked) {
      checked = true;
      if(!key.startsWith('_:')) {
        // map doesn't use prefixes, return it
        return map;
      }
    }
    stripped.set(key.slice(2), value.slice(2));
  }
  return stripped;
}

async function _labelReplacementCanonicalizeNQuads({
  document, nquads, labelMapFactoryFunction, options
} = {}) {
  let canonicalIdMap = new Map();
  let canonicalNQuads;
  if(document) {
    canonicalNQuads = await canonicalize(
      document, {...options, canonicalIdMap});
  } else {
    canonicalNQuads = await canonicalize(
      nquads.join(''),
      {...options, inputFormat: 'application/n-quads', canonicalIdMap});
  }

  // ensure labels in map do not include `_:` prefix
  canonicalIdMap = stripBlankNodePrefixes(canonicalIdMap);

  // create label map
  const replacementLabelMap = await labelMapFactoryFunction({canonicalIdMap});

  /* Note: In this current implementation, the replacement label map is
  replaced with one that maps the C14N labels to the new labels instead of
  the input labels to the new labels. This is because the C14N labels are
  already in use in the N-Quads that are updated. */
  const c14nToNewLabelMap = new Map();
  for(const [input, newLabel] of replacementLabelMap) {
    c14nToNewLabelMap.set(canonicalIdMap.get(input), newLabel);
  }
  const replacer = (m, s1, label) => '_:' + c14nToNewLabelMap.get(label);

  // FIXME: see if `relabelBlankNodes` can be reused
  const outputNQuads = canonicalNQuads.split('\n').slice(0, -1)
    .map(e => e.replace(/(_:([^\s]+))/g, replacer) + '\n')
    // FIXME: sort should be by unicode code point, not utf-16 code unit
    .sort();

  // generate map of input labels to final output labels
  const labelMap = new Map();
  for(const [input, output] of canonicalIdMap) {
    labelMap.set(input, replacementLabelMap.get(output));
  }

  return {nquads: outputNQuads, labelMap};
}
