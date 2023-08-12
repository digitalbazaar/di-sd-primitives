/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import {klona} from 'klona';

// JSON pointer escape sequences
// ~0 => '~'
// ~1 => '/'
const POINTER_ESCAPE_REGEX = /~[01]/g;

export function pointersToFrames({
  document, pointers, includeTypes = true
} = {}) {
  if(!(document && typeof document === 'object')) {
    throw new TypeError('"document" must be an object.');
  }
  if(!Array.isArray(pointers)) {
    throw new TypeError('"pointers" must be an array.');
  }
  if(pointers.length === 0) {
    // no pointers, so indicate nothing was selected with `null` value
    return null;
  }

  const frames = [];
  const arrays = [];
  const frame = {'@context': klona(document['@context'])};
  _initSelection({selection: frame, source: document, includeTypes});
  for(const pointer of pointers) {
    // parse pointer into individual paths
    const paths = _parsePointer(pointer);
    if(paths.length === 0) {
      // whole document selected; indicate with empty set of frames whereas
      // a `null` value for `frames` would indicate nothing was selected
      return [];
    }
    _selectPaths({
      document, pointer, paths, selectionDocument: frame,
      frames, arrays, includeTypes
    });
  }

  // make any sparse arrays dense
  for(const array of arrays) {
    let i = 0;
    while(i < array.length) {
      if(array[i] === undefined) {
        array.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  frames.push(frame);
  return frames;
}

// FIXME: nearly identical to `pointersToFrame`, get reuse out of it
export function select({document, pointers, includeTypes = true} = {}) {
  if(!(document && typeof document === 'object')) {
    throw new TypeError('"document" must be an object.');
  }
  if(!Array.isArray(pointers)) {
    throw new TypeError('"pointers" must be an array.');
  }
  if(pointers.length === 0) {
    // no pointers, so no frame
    return null;
  }
  const arrays = [];
  const selectionDocument = {'@context': klona(document['@context'])};
  _initSelection(
    {selection: selectionDocument, source: document, includeTypes});
  for(const pointer of pointers) {
    // parse pointer into individual paths
    const paths = _parsePointer(pointer);
    if(paths.length === 0) {
      // whole document selected
      // FIXME: won't work for frames ... should return empty frames list
      // instead to indicate everything is selected
      return klona(document);
    }
    _selectPaths({
      document, pointer, paths, selectionDocument, arrays, includeTypes
    });
  }

  // make any sparse arrays dense
  for(const array of arrays) {
    let i = 0;
    while(i < array.length) {
      if(array[i] === undefined) {
        array.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  return selectionDocument;
}

function _selectPaths({
  document, pointer, paths, selectionDocument,
  frames, arrays, includeTypes
} = {}) {
  // make pointer path in selection document
  let parentValue = document;
  let value = parentValue;
  let selectedParent = selectionDocument;
  let selectedValue = selectedParent;
  for(const path of paths) {
    selectedParent = selectedValue;
    parentValue = value;

    // get next document value
    value = parentValue[path];
    if(value === undefined) {
      throw new TypeError(
        `JSON pointer "${pointer}" does not match document.`);
    }

    // get next value selection
    selectedValue = selectedParent[path];
    if(selectedValue === undefined) {
      /* Note: When `frames` is set, `selectionDocument` is a frame. If
      `selectedParent` is a non-empty array without an element matching `path`,
      then duplicate the current frame (as JSON-LD 1.1 frames do not
      support multiple array elements) and append it to `frames` and clear
      the current `selectedParent` to add the next value. */
      if(frames && Array.isArray(selectedParent) && selectedParent.length > 0) {
        frames.push(klona(selectionDocument));
        selectedParent.length = 0;
      }

      if(Array.isArray(value)) {
        selectedValue = [];
        arrays.push(selectedValue);
      } else {
        selectedValue = _initSelection({source: value, includeTypes});
      }
      selectedParent[path] = selectedValue;
    }
  }

  // path traversal complete, compute selected value
  if(typeof value !== 'object') {
    // literal selected
    selectedValue = value;
  } else if(Array.isArray(value)) {
    // FIXME: if `frames` is set, a new frame is needed per value
    selectedValue = value.map(e => {
      if(Array.isArray(e)) {
        // FIXME: determine if these can be supported
        throw new TypeError('Arrays of arrays are not supported.');
      }
      return klona(e);
    });
  } else {
    selectedValue = {...selectedValue, ...klona(value)};
  }

  // add selected value to selected parent
  selectedParent[paths.at(-1)] = selectedValue;
}

function _initSelection({selection = {}, source, includeTypes}) {
  // must include non-blank node IDs
  if(source.id && !source.id.startsWith('_:')) {
    selection.id = source.id;
  }
  // include types if directed to do so
  if(includeTypes && source.type) {
    selection.type = source.type;
  }
  return selection;
}

function _parsePointer(pointer) {
  // see RFC 6901: https://www.rfc-editor.org/rfc/rfc6901.html
  const parsed = [];
  const paths = pointer.split('/').slice(1);
  for(const path of paths) {
    if(!path.includes('~')) {
      // convert any numerical path to a number as an array index
      const index = parseInt(path, 10);
      parsed.push(isNaN(index) ? path : index);
    } else {
      parsed.push(path.replace(POINTER_ESCAPE_REGEX, _unescapePointerPath));
    }
  }
  return parsed;
}

function _unescapePointerPath(m) {
  if(m === '~1') {
    return '/';
  }
  if(m === '~0') {
    return '~';
  }
  throw new Error(`Invalid JSON pointer escape sequence "${m}".`);
}
