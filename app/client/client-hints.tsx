import { getHintUtils } from '@epic-web/client-hints'
import { useRequestInfo } from './request-info';
import { clientHint as colourSchemeHint, subscribeToSchemeChange } from '@epic-web/client-hints/color-scheme'
import { useRevalidator } from '@remix-run/react';
import React from 'react';
/**
 * @returns an object with the client hints and their values
 */
export function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}


const hintsUtils = getHintUtils({ theme: colourSchemeHint });

export const { getHints } = hintsUtils;


export function ClientHintCheck() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}