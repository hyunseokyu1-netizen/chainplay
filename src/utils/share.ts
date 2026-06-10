import { Share } from 'react-native';
import { Chain } from '../types';

const SHARE_BASE_URL = 'https://hyunseokYeo.github.io/chainplay/';
export const MAX_SHARE_ITEMS = 20;

type SharePayload = {
  n: string;
  v: Array<{ i: string; t: string }>;
};

function toBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

function fromBase64(b64: string): string {
  return decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function encodeChain(chain: Chain): string {
  const payload: SharePayload = {
    n: chain.name,
    v: chain.items.slice(0, MAX_SHARE_ITEMS).map(({ videoId, title }) => ({
      i: videoId,
      t: title,
    })),
  };
  return toBase64(JSON.stringify(payload));
}

export type DecodedChain = {
  name: string;
  videos: Array<{ videoId: string; title: string }>;
};

export function decodeChain(base64: string): DecodedChain | null {
  try {
    const payload: SharePayload = JSON.parse(fromBase64(base64));
    return {
      name: payload.n,
      videos: payload.v.map((v) => ({ videoId: v.i, title: v.t })),
    };
  } catch {
    return null;
  }
}

export async function shareChain(chain: Chain): Promise<void> {
  const base64 = encodeChain(chain);
  const url = `${SHARE_BASE_URL}?c=${encodeURIComponent(base64)}`;
  await Share.share({ message: url, title: chain.name });
}
