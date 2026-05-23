import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Folder, PlaylistItem } from '../types';
import { extractVideoId, fetchVideoInfo } from '../utils/youtube';
import { t } from '../i18n';

const FOLDERS_KEY = '@yt_folders';
const LEGACY_KEY = '@yt_playlist';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const raw = await AsyncStorage.getItem(FOLDERS_KEY);
      if (raw) {
        setFolders(JSON.parse(raw));
        return;
      }
      // 기존 단일 플레이리스트를 기본 폴더로 마이그레이션
      const legacy = await AsyncStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const items: PlaylistItem[] = JSON.parse(legacy);
        const defaultFolder: Folder = {
          id: `folder_${Date.now()}`,
          name: t.defaultFolderName,
          items,
          createdAt: Date.now(),
        };
        const initial = [defaultFolder];
        setFolders(initial);
        await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(initial));
        await AsyncStorage.removeItem(LEGACY_KEY);
      }
    }
    load();
  }, []);

  const save = useCallback((data: Folder[]) => {
    AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(data));
  }, []);

  const createFolder = useCallback(
    (name: string) => {
      const folder: Folder = {
        id: `folder_${Date.now()}`,
        name: name.trim(),
        items: [],
        createdAt: Date.now(),
      };
      setFolders((prev) => {
        const next = [...prev, folder];
        save(next);
        return next;
      });
    },
    [save]
  );

  const renameFolder = useCallback(
    (id: string, name: string) => {
      setFolders((prev) => {
        const next = prev.map((f) => (f.id === id ? { ...f, name: name.trim() } : f));
        save(next);
        return next;
      });
    },
    [save]
  );

  const deleteFolder = useCallback(
    (id: string) => {
      setFolders((prev) => {
        const next = prev.filter((f) => f.id !== id);
        save(next);
        return next;
      });
    },
    [save]
  );

  const addUrlToFolder = useCallback(
    async (folderId: string, url: string): Promise<string | null> => {
      const videoId = extractVideoId(url);
      if (!videoId) return t.invalidUrl;

      const folder = folders.find((f) => f.id === folderId);
      if (folder?.items.some((p) => p.videoId === videoId)) return t.alreadyExists;

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

      setFolders((prev) => {
        const next = prev.map((f) =>
          f.id === folderId ? { ...f, items: [...f.items, item] } : f
        );
        save(next);
        return next;
      });
      return null;
    },
    [folders, save]
  );

  const removeItemFromFolder = useCallback(
    (folderId: string, itemId: string) => {
      setFolders((prev) => {
        const next = prev.map((f) =>
          f.id === folderId ? { ...f, items: f.items.filter((i) => i.id !== itemId) } : f
        );
        save(next);
        return next;
      });
    },
    [save]
  );

  const moveItemInFolder = useCallback(
    (folderId: string, index: number, direction: 'up' | 'down') => {
      setFolders((prev) => {
        const next = prev.map((f) => {
          if (f.id !== folderId) return f;
          const items = [...f.items];
          const target = direction === 'up' ? index - 1 : index + 1;
          if (target < 0 || target >= items.length) return f;
          [items[index], items[target]] = [items[target], items[index]];
          return { ...f, items };
        });
        save(next);
        return next;
      });
    },
    [save]
  );

  const moveItemBetweenFolders = useCallback(
    (itemId: string, fromFolderId: string, toFolderId: string) => {
      setFolders((prev) => {
        let movedItem: PlaylistItem | undefined;
        const afterRemove = prev.map((f) => {
          if (f.id !== fromFolderId) return f;
          movedItem = f.items.find((i) => i.id === itemId);
          return { ...f, items: f.items.filter((i) => i.id !== itemId) };
        });
        if (!movedItem) return prev;
        const captured = movedItem;
        const next = afterRemove.map((f) => {
          if (f.id !== toFolderId) return f;
          // 대상 폴더에 같은 영상이 이미 있으면 추가하지 않음
          if (f.items.some((i) => i.videoId === captured.videoId)) return f;
          return { ...f, items: [...f.items, captured] };
        });
        save(next);
        return next;
      });
    },
    [save]
  );

  return {
    folders,
    isLoading,
    createFolder,
    renameFolder,
    deleteFolder,
    addUrlToFolder,
    removeItemFromFolder,
    moveItemInFolder,
    moveItemBetweenFolders,
  };
}
