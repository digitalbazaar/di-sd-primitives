/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc.
 */
import dataIntegrityContext from '@digitalbazaar/data-integrity-context';
import {securityLoader} from '@digitalbazaar/security-document-loader';

export const loader = securityLoader();

loader.addStatic(
  dataIntegrityContext.constants.CONTEXT_URL,
  dataIntegrityContext.contexts.get(
    dataIntegrityContext.constants.CONTEXT_URL));
