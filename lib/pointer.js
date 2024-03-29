/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
// JSON pointer escape sequences
// ~0 => '~'
// ~1 => '/'
const POINTER_ESCAPE_REGEX = /~[01]/g;

export function parsePointer(pointer) {
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
