/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {skolemizeCompactJsonLd, toDeskolemizedNQuads} from './skolemize.js';
import {labelReplacementCanonicalizeNQuads} from './canonicalize.js';
import {selectCanonicalNQuads} from './select.js';

export async function canonicalizeAndGroup({
  document, labelReplacementFunction, groups, options
} = {}) {
  // 1. Skolemize JSON-LD `document`.
  const {skolemized} = await skolemizeCompactJsonLd({document, options});

  // 2. Get deskolemized N-Quads for the whole document.
  const deskolemizedNQuads = await toDeskolemizedNQuads(
    {document: skolemized.expanded, options});

  // 3. Get canonicalized N-Quads and label map to convert deskolemized
  //   N-Quads to canonical N-Quads.
  const {labelMap, nquads} = await labelReplacementCanonicalizeNQuads({
    nquads: deskolemizedNQuads, labelReplacementFunction, options
  });

  // 4. In parallel, produce each selection of canonical N-Quads using the
  //   JSON pointers from each named group.
  const selections = new Map();
  await Promise.all(Object.fromEntries(groups).map(async ([name, pointers]) => {
    selections.set(name, await selectCanonicalNQuads(
      {document: skolemized.compact, pointers, labelMap, options}));
  }));

  // 5. Group matching and non-matching N-Quads for each selection.
  const results = {};
  for(const [name, selectionResult] of selections) {
    const matching = new Map();
    const nonMatching = new Map();
    const {nquads: selectedNQuads, deskolemizedNQuads} = selectionResult;
    nquads.forEach((nq, index) => selectedNQuads.includes(nq) ?
      matching.set(index, nq) : nonMatching.set(index, nq));
    results[name] = {matching, nonMatching, deskolemizedNQuads};
  }

  return {groups: results, skolemized, deskolemizedNQuads, labelMap, nquads};
}