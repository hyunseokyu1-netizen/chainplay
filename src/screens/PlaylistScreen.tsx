import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chain, PlaylistItem } from '../types';
import { t } from '../i18n';
import { shareChain } from '../utils/share';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import AddUrlModal from '../components/AddUrlModal';
import MoveToChainModal from '../components/MoveToChainModal';

interface Props {
  chain: Chain;
  allChains: Chain[];
  isLoading: boolean;
  bottomInset: number;
  onBack: () => void;
  onAddUrl: (chainId: string, url: string) => Promise<string | null>;
  onRemoveItem: (chainId: string, itemId: string) => void;
  onMoveItemInChain: (chainId: string, index: number, direction: 'up' | 'down') => void;
  onMoveItemBetweenChains: (itemId: string, fromChainId: string, toChainId: string) => void;
}

export default function PlaylistScreen({
  chain,
  allChains,
  isLoading,
  bottomInset,
  onBack,
  onAddUrl,
  onRemoveItem,
  onMoveItemInChain,
  onMoveItemBetweenChains,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [moveTarget, setMoveTarget] = useState<PlaylistItem | null>(null);

  const items = chain.items;

  const playNext = useCallback(() => {
    setCurrentIndex((ci) => (ci + 1 < items.length ? ci + 1 : ci));
  }, [items.length]);

  const playPrev = useCallback(() => {
    setCurrentIndex((ci) => (ci > 0 ? ci - 1 : 0));
  }, []);

  const handleRemove = useCallback(
    (itemId: string) => {
      const idx = items.findIndex((i) => i.id === itemId);
      const len = items.length;
      onRemoveItem(chain.id, itemId);
      setCurrentIndex((ci) => {
        if (len <= 1) return 0;
        if (idx < ci) return ci - 1;
        if (idx === ci) return Math.min(ci, len - 2);
        return ci;
      });
    },
    [chain.id, items, onRemoveItem]
  );

  const handleMoveInChain = useCallback(
    (index: number, direction: 'up' | 'down') => {
      onMoveItemInChain(chain.id, index, direction);
      setCurrentIndex((ci) => {
        const target = direction === 'up' ? index - 1 : index + 1;
        if (ci === index) return target;
        if (ci === target) return index;
        return ci;
      });
    },
    [chain.id, onMoveItemInChain]
  );

  const handleMoveToChain = useCallback(
    (toChainId: string) => {
      if (!moveTarget) return;
      const idx = items.findIndex((i) => i.id === moveTarget.id);
      const len = items.length;
      onMoveItemBetweenChains(moveTarget.id, chain.id, toChainId);
      setCurrentIndex((ci) => {
        if (len <= 1) return 0;
        if (idx < ci) return ci - 1;
        if (idx === ci) return Math.min(ci, len - 2);
        return ci;
      });
      setMoveTarget(null);
    },
    [chain.id, items, moveTarget, onMoveItemBetweenChains]
  );

  const handleShare = useCallback(() => {
    shareChain(chain);
  }, [chain]);

  const currentItem = items[currentIndex] ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={8}>
          <Text style={styles.backText}>{t.backToChains}</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleShare} hitSlop={8}>
            <Text style={styles.shareText}>{t.shareChain}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Player
        item={currentItem}
        onEnded={playNext}
        onPrev={playPrev}
        onNext={playNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < items.length - 1}
      />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{chain.name}</Text>
        <Text style={styles.listCount}>{t.itemCount(items.length)}</Text>
      </View>

      <View style={styles.listContainer}>
        <Playlist
          playlist={items}
          currentIndex={currentIndex}
          onMoveUp={(i) => handleMoveInChain(i, 'up')}
          onMoveDown={(i) => handleMoveInChain(i, 'down')}
          onDelete={handleRemove}
          onPlay={setCurrentIndex}
          onMoveToChain={allChains.length > 1 ? setMoveTarget : undefined}
        />
        <TouchableOpacity
          style={[styles.addUrlBtn, { bottom: 16 + bottomInset }]}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addUrlBtnText}>{t.addUrlBtn}</Text>
        </TouchableOpacity>
      </View>

      <AddUrlModal
        visible={addModalVisible}
        isLoading={isLoading}
        onAdd={(url) => onAddUrl(chain.id, url)}
        onClose={() => setAddModalVisible(false)}
        bottomInset={bottomInset}
      />

      <MoveToChainModal
        visible={moveTarget !== null}
        item={moveTarget}
        chains={allChains}
        currentChainId={chain.id}
        bottomInset={bottomInset}
        onMove={handleMoveToChain}
        onClose={() => setMoveTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e2e',
  },
  backBtn: {},
  backText: {
    color: '#00d8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  shareText: {
    color: '#00d8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  listTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  listCount: {
    color: '#888',
    fontSize: 13,
  },
  listContainer: {
    flex: 1,
  },
  addUrlBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#8b1a1a',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  addUrlBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
