import { Share } from 'react-native';
import { Chain } from '../types';

const SHARE_BASE_URL = 'https://hyunseokyu1-netizen.github.io/chainplay/';
export const MAX_SHARE_ITEMS = 20;

const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export type DecodedChain = {
  name: string;
  // title이 빈 문자열이면 수신 측에서 oEmbed로 채움
  videos: Array<{ videoId: string; title: string }>;
};

function fromBase64(b64: string): string {
  const standard = b64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = standard + '=='.slice((standard.length + 3) % 4);
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

// 구버전 링크(?data=<base64 JSON>) 호환용
export function decodeChain(base64: string): DecodedChain | null {
  try {
    const payload: { n: string; v: Array<{ i: string; t: string }> } =
      JSON.parse(fromBase64(base64));
    return {
      name: payload.n,
      videos: payload.v.map((v) => ({ videoId: v.i, title: v.t })),
    };
  } catch {
    return null;
  }
}

// 새 형식: ?n=<체인이름>&v=<videoId,videoId,...>
// videoId는 [a-zA-Z0-9_-] 11자라 그 자체로 URL-safe — 인코딩 불필요
export function buildShareUrl(chain: Chain): string {
  const ids = chain.items.slice(0, MAX_SHARE_ITEMS).map((item) => item.videoId);
  return `${SHARE_BASE_URL}?n=${encodeURIComponent(chain.name)}&v=${ids.join(',')}`;
}

// 딥링크 URL에서 체인 정보 추출. 새 형식(n+v)과 구 형식(data) 모두 지원.
// RN의 URLSearchParams는 get()이 미구현이라 정규식으로 파싱.
export function parseShareUrl(url: string): DecodedChain | null {
  const n = url.match(/[?&]n=([^&]+)/);
  const v = url.match(/[?&]v=([^&]+)/);
  if (n && v) {
    const ids = v[1].split(',').filter((id) => VIDEO_ID_RE.test(id));
    if (ids.length === 0) return null;
    try {
      return {
        name: decodeURIComponent(n[1]),
        videos: ids.map((videoId) => ({ videoId, title: '' })),
      };
    } catch {
      return null;
    }
  }

  const data = url.match(/[?&]data=([^&]+)/);
  if (data) return decodeChain(decodeURIComponent(data[1]));

  return null;
}

export async function shareChain(chain: Chain): Promise<void> {
  await Share.share({ message: buildShareUrl(chain) });
}
