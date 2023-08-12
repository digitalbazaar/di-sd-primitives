/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {skolemize, toDeskolemizedRDF} from './skolemize.js';
import {frame as _frame} from './frame.js';
import {canonize} from './canonize.js';
import jsonld from 'jsonld';

// FIXME: simplified appoach:
/*

expandedDoc = expand(doc)
skolemizedDoc = skolemize(expandedDoc)
skolemizedNQuads = rdf(skolemizedDoc)
stableNQuads = deskolemizeNQuads(skolemizedNQuads)
stableIdToC14NBnodeMap = canonize(stableNQuads)

compactedDoc = compact(skolemizedDoc)
selection = select(compactedDoc, pointers)
{revealDoc, selectedStableBnodeIds} = deskolemizeDoc(compactedDoc)

selectedBnodeMapping = applyStableIdToC14NBnodeMap(selectedStableBnodeIds)

send(revealDoc, selectedBnodeMapping) // to verifier

*/

export async function filterAndGroup({
  nquads, filterFrames, groupFrames, options
} = {}) {
  // 1. Filter N-Quads using `filterFrames`.
  const filteredNQuads = await _filter({nquads, frames: filterFrames, options});

  // 2. In parallel, canonize `filteredNQuads` to get bnode identifier map and
  //   group `filteredDoc` N-Quads into those that match/do not match
  //   `groupFrame`.
  const canonicalIdMap = new Map();
  const [, groupResult] = await Promise.all([
    canonize(
      filteredNQuads.join(''),
      {...options, inputFormat: 'application/n-quads', canonicalIdMap}),
    group({nquads: filteredNQuads, frames: groupFrames, options})
  ]);

  // 3. Generate matching and non-matching maps based on original `nquads`.
  const matching = new Map();
  const nonMatching = new Map();
  const filteredMatches = [...groupResult.matching.values()];
  const filteredNonMatches = [...groupResult.nonMatching.values()];
  for(const [index, nq] of nquads.entries()) {
    if(matching.size < filteredMatches.length &&
      filteredMatches.includes(nq)) {
      matching.set(index, nq);
    } else if(nonMatching.size < filteredNonMatches.length &&
      filteredNonMatches.includes(nq)) {
      nonMatching.set(index, nq);
    }
  }

  // 4. Return filtered and grouping results and bnode ID labelMap.
  return {
    filtered: groupResult,
    labelMap: _createLabelMap(canonicalIdMap),
    matching,
    nonMatching
  };
}

export async function group({nquads, frames, options} = {}) {
  // 1. Filter N-Quads using `frames` to get matching N-Quads.
  const matchingNQuads = await _filter({nquads, frames, options});

  // optimization: all N-Quads matched
  if(matchingNQuads.length === nquads) {
    return {
      nquads,
      matching: new Map([...nquads.entries()]),
      nonMatching: new Map()
    };
  }

  // optimization: no N-Quads matched
  if(matchingNQuads.length === 0) {
    return {
      nquads,
      matching: new Map(),
      nonMatching: new Map([...nquads.entries()])
    };
  }

  // 2. Split N-Quads into matching / non-matching groups.
  const matching = new Map();
  const nonMatching = new Map();
  for(const [index, nq] of nquads.entries()) {
    // if all matching quads not yet found and nquad matches
    if(matching.size < matchingNQuads.length &&
      matchingNQuads.includes(nq)) {
      matching.set(index, nq);
    } else {
      nonMatching.set(index, nq);
    }
  }

  return {nquads, matching, nonMatching};
}

async function _filter({nquads, frames, options} = {}) {
  // 1. If `frames` is `null`, it means "select none".
  if(!frames) {
    return [];
  }

  // 2. If `frames` is an empty array, it means "select all"
  if(frames.length === 0) {
    return nquads.slice();
  }

  // 3. Produce skolemized nquads and JSON-LD document for filtering purposes.
  const skolemized = skolemize({nquads});
  const skolemizedDoc = await _createSkolemizedDocument({skolemized, options});

  // 4. For each frame, produce and append filtered N-Quads to a Set.
  const filteredNQuadsSet = new Set();

  for(const frame of frames) {
    // 4.1. Apply frame to produce filtered document.
    const filteredDoc = await _frame(skolemizedDoc, frame, options);
    // 4.2. Get deskolemized N-Quads from the filtered document.
    const filteredNQuads = await toDeskolemizedRDF({doc: filteredDoc, options});
    // 4.3. Add each deskolemized N-Quads to the filtered N-Quads Set.
    filteredNQuads.forEach(filteredNQuadsSet.add.bind(filteredNQuadsSet));
  }

  // 5. Return Set as an array of filtered N-Quads.
  return [...filteredNQuadsSet];
}

async function _createSkolemizedDocument({skolemized, options} = {}) {
  // produce skolemized dataset document for filtering purposes
  const dataset = skolemized.join('');
  const rdfOptions = {...options, format: 'application/n-quads'};
  return jsonld.fromRDF(dataset, rdfOptions);
}

function _createLabelMap(map) {
  // reverse map
  const reversed = new Map();
  for(const [k, v] of map.entries()) {
    // also handle removing `_:` prefix
    reversed.set(v.slice(2), k.slice(2));
  }
  return reversed;
}
