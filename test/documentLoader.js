/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */
import dataIntegrityContext from '@digitalbazaar/data-integrity-context';
import {securityLoader} from '@digitalbazaar/security-document-loader';

export const loader = securityLoader();

loader.addStatic(
  dataIntegrityContext.constants.CONTEXT_URL,
  dataIntegrityContext.contexts.get(
    dataIntegrityContext.constants.CONTEXT_URL));
