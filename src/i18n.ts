import { NativeModules, Platform } from 'react-native';

function detectLocale(): string {
  // Hermes (RN 0.71+) 기본 내장 Intl — 가장 신뢰도 높음
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale;
    if (loc && loc !== 'und' && loc.length >= 2) return loc;
  } catch {}

  // iOS 폴백
  if (Platform.OS === 'ios') {
    const sm = (NativeModules as any).SettingsManager;
    return sm?.settings?.AppleLocale ?? sm?.settings?.AppleLanguages?.[0] ?? 'en';
  }

  // Android 폴백
  return (NativeModules as any).I18nManager?.localeIdentifier ?? 'en';
}

export const detectedLocale = detectLocale();
const isKorean = detectedLocale.startsWith('ko');

export const t = {
  // App.tsx
  playlistHeader: isKorean ? '재생 목록' : 'Playlist',
  itemCount: (n: number) => isKorean ? `${n}개` : `${n}`,
  addUrlBtn: isKorean ? '+ URL 추가' : '+ Add URL',

  // Player.tsx
  playerEmpty: isKorean ? '플레이리스트에 영상을 추가해주세요' : 'Add videos to get started',

  // Playlist.tsx
  listEmpty: isKorean ? '플레이리스트가 비어있습니다' : 'Your playlist is empty',
  listEmptyHint: isKorean ? '아래 + 버튼으로 유튜브 URL을 추가해보세요' : 'Tap + below to add a YouTube URL',

  // AddUrlModal.tsx
  modalTitle: isKorean ? 'YouTube URL 추가' : 'Add YouTube URL',
  inputPlaceholder: isKorean ? 'YouTube URL을 붙여넣기 하세요' : 'Paste YouTube URL here',
  addButton: isKorean ? '+ 플레이리스트에 추가' : '+ Add to Playlist',
  urlHint: isKorean
    ? 'youtube.com/watch?v=... 또는 youtu.be/... 형식 지원'
    : 'Supports youtube.com/watch?v=... or youtu.be/...',

  // 에러 메시지
  invalidUrl: isKorean ? '유효한 유튜브 URL이 아닙니다.' : 'Invalid YouTube URL.',
  alreadyExists: isKorean ? '이미 플레이리스트에 있습니다.' : 'Already in your playlist.',

  // 체인 관련
  chainIntroDesc: isKorean
    ? '체인 — 영상을 순서대로 묶어 연속 재생하는 목록'
    : 'Chain — a playlist that plays videos in sequence',
  defaultChainName: isKorean ? '기본 체인' : 'Default',
  chainListTitle: isKorean ? '체인' : 'Chains',
  newChain: isKorean ? '+ 새 체인' : '+ New Chain',
  noChains: isKorean ? '체인이 없습니다' : 'No chains yet',
  noChainsHint: isKorean ? '아래 버튼으로 체인을 만들어보세요' : 'Tap + to create a chain',
  chainVideoCount: (n: number) => isKorean ? `영상 ${n}개` : `${n} video${n === 1 ? '' : 's'}`,
  createChainTitle: isKorean ? '체인 만들기' : 'New Chain',
  renameChainTitle: isKorean ? '이름 변경' : 'Rename',
  chainNamePlaceholder: isKorean ? '체인 이름' : 'Chain name',
  confirm: isKorean ? '확인' : 'OK',
  cancel: isKorean ? '취소' : 'Cancel',
  deleteChainConfirm: (name: string) =>
    isKorean
      ? `"${name}" 체인을 삭제할까요?\n영상 목록도 함께 삭제됩니다.`
      : `Delete "${name}"?\nAll videos in it will be removed.`,
  moveToChain: isKorean ? '체인으로 이동' : 'Move to Chain',
  moveToChainHint: isKorean ? '이동할 체인을 선택하세요' : 'Select destination chain',
  noOtherChains: isKorean ? '다른 체인이 없습니다' : 'No other chains',
  backToChains: isKorean ? '← 체인 목록' : '← Chains',

  // 공유
  shareChain: isKorean ? '공유' : 'Share',
  importChainTitle: isKorean ? '체인 가져오기' : 'Import Chain',
  importChainDesc: (name: string, count: number) =>
    isKorean
      ? `"${name}" (영상 ${count}개)을 새 체인으로 가져올까요?`
      : `Import "${name}" (${count} video${count === 1 ? '' : 's'}) as a new chain?`,
  importChainFailed: isKorean ? '공유 링크를 읽을 수 없습니다.' : 'Could not read the share link.',
};
