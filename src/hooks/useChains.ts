import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chain, PlaylistItem } from '../types';
import { extractVideoId, fetchVideoInfo } from '../utils/youtube';
import { t } from '../i18n';

const CHAINS_KEY = '@yt_folders';
const LEGACY_KEY = '@yt_playlist';

export function useChains() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(CHAINS_KEY);
      if (raw) {
        setChains(JSON.parse(raw));
        return;
      }
      // 기존 단일 플레이리스트를 기본 체인으로 마이그레이션
      const legacy = await AsyncStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const items: PlaylistItem[] = JSON.parse(legacy);
        const defaultChain: Chain = {
          id: `chain_${Date.now()}`,
          name: t.defaultChainName,
          items,
          createdAt: Date.now(),
        };
        const initial = [defaultChain];
        setChains(initial);
        await AsyncStorage.setItem(CHAINS_KEY, JSON.stringify(initial));
        await AsyncStorage.removeItem(LEGACY_KEY);
      }
    }
    load();
  }, []);

  const save = useCallback((data: Chain[]) => {
    AsyncStorage.setItem(CHAINS_KEY, JSON.stringify(data));
  }, []);

  const createChain = useCallback(
    (name: string) => {
      const chain: Chain = {
        id: `chain_${Date.now()}`,
        name: name.trim(),
        items: [],
        createdAt: Date.now(),
      };
      setChains((prev) => {
        const next = [...prev, chain];
        save(next);
        return next;
      });
    },
    [save]
  );

  const renameChain = useCallback(
    (id: string, name: string) => {
      setChains((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c));
        save(next);
        return next;
      });
    },
    [save]
  );

  const deleteChain = useCallback(
    (id: string) => {
      setChains((prev) => {
        const next = prev.filter((c) => c.id !== id);
        save(next);
        return next;
      });
    },
    [save]
  );

  const addUrlToChain = useCallback(
    async (chainId: string, url: string): Promise<string | null> => {
      const videoId = extractVideoId(url);
      if (!videoId) return t.invalidUrl;

      const chain = chains.find((c) => c.id === chainId);
      if (chain?.items.some((p) => p.videoId === videoId)) return t.alreadyExists;

      setIsLoading(true);
      const info = await fetchVideoInfo(url);
      setIsLoading(false);

      const item: PlaylistItem = {
        id: `${videoId}_${Date.now()}`,
        videoId,
        title: info?.title ?? url,
        thumbnail: info?.thumbnail ?? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        url,
      };

      setChains((prev) => {
        const next = prev.map((c) =>
          c.id === chainId ? { ...c, items: [...c.items, item] } : c
        );
        save(next);
        return next;
      });
      return null;
    },
    [chains, save]
  );

  const removeItemFromChain = useCallback(
    (chainId: string, itemId: string) => {
      setChains((prev) => {
        const next = prev.map((c) =>
          c.id === chainId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
        );
        save(next);
        return next;
      });
    },
    [save]
  );

  const moveItemInChain = useCallback(
    (chainId: string, index: number, direction: 'up' | 'down') => {
      setChains((prev) => {
        const next = prev.map((c) => {
          if (c.id !== chainId) return c;
          const items = [...c.items];
          const target = direction === 'up' ? index - 1 : index + 1;
          if (target < 0 || target >= items.length) return c;
          [items[index], items[target]] = [items[target], items[index]];
          return { ...c, items };
        });
        save(next);
        return next;
      });
    },
    [save]
  );

  const moveItemBetweenChains = useCallback(
    (itemId: string, fromChainId: string, toChainId: string) => {
      setChains((prev) => {
        let movedItem: PlaylistItem | undefined;
        const afterRemove = prev.map((c) => {
          if (c.id !== fromChainId) return c;
          movedItem = c.items.find((i) => i.id === itemId);
          return { ...c, items: c.items.filter((i) => i.id !== itemId) };
        });
        if (!movedItem) return prev;
        const captured = movedItem;
        const next = afterRemove.map((c) => {
          if (c.id !== toChainId) return c;
          // 대상 체인에 같은 영상이 이미 있으면 추가하지 않음
          if (c.items.some((i) => i.videoId === captured.videoId)) return c;
          return { ...c, items: [...c.items, captured] };
        });
        save(next);
        return next;
      });
    },
    [save]
  );

  return {
    chains,
    isLoading,
    createChain,
    renameChain,
    deleteChain,
    addUrlToChain,
    removeItemFromChain,
    moveItemInChain,
    moveItemBetweenChains,
  };
}
