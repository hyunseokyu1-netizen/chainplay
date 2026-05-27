import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chain } from '../types';
import { t } from '../i18n';
import ChainNameModal from '../components/ChainNameModal';

const INTRO_SEEN_KEY = '@chain_intro_seen';

interface Props {
  chains: Chain[];
  bottomInset: number;
  onSelectChain: (id: string) => void;
  onCreateChain: (name: string) => void;
  onRenameChain: (id: string, name: string) => void;
  onDeleteChain: (id: string) => void;
}

export default function ChainListScreen({
  chains,
  bottomInset,
  onSelectChain,
  onCreateChain,
  onRenameChain,
  onDeleteChain,
}: Props) {
  const [modalMode, setModalMode] = useState<'create' | 'rename' | null>(null);
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(INTRO_SEEN_KEY).then((val) => {
      if (!val) setShowIntro(true);
    });
  }, []);

  const dismissIntro = () => {
    setShowIntro(false);
    AsyncStorage.setItem(INTRO_SEEN_KEY, '1');
  };

  const openCreate = () => {
    setEditingChain(null);
    setModalMode('create');
  };

  const openRename = (chain: Chain) => {
    setEditingChain(chain);
    setModalMode('rename');
  };

  const handleConfirm = (name: string) => {
    if (modalMode === 'create') {
      onCreateChain(name);
    } else if (modalMode === 'rename' && editingChain) {
      onRenameChain(editingChain.id, name);
    }
  };

  const handleDelete = (chain: Chain) => {
    Alert.alert('', t.deleteChainConfirm(chain.name), [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: () => onDeleteChain(chain.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {showIntro && (
        <View style={styles.introBanner}>
          <Text style={styles.introText}>{t.chainIntroDesc}</Text>
          <TouchableOpacity onPress={dismissIntro} hitSlop={8}>
            <Text style={styles.introClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      {chains.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.noChains}</Text>
          <Text style={styles.emptyHint}>{t.noChainsHint}</Text>
        </View>
      ) : (
        <FlatList
          data={chains}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: chain }) => (
            <TouchableOpacity
              style={styles.chainRow}
              onPress={() => onSelectChain(chain.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chainIconWrap}>
                <View style={styles.chainIconTab} />
                <View style={styles.chainIconBody} />
              </View>
              <View style={styles.chainInfo}>
                <Text style={styles.chainName} numberOfLines={1}>
                  {chain.name}
                </Text>
                <Text style={styles.chainCount}>
                  {t.chainVideoCount(chain.items.length)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openRename(chain)}
                hitSlop={8}
              >
                <Text style={styles.actionIcon}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDelete(chain)}
                hitSlop={8}
              >
                <Text style={styles.actionIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: 16 + bottomInset }]}
        onPress={openCreate}
      >
        <Text style={styles.fabText}>{t.newChain}</Text>
      </TouchableOpacity>

      <ChainNameModal
        visible={modalMode !== null}
        mode={modalMode ?? 'create'}
        initialName={editingChain?.name ?? ''}
        bottomInset={bottomInset}
        onConfirm={handleConfirm}
        onClose={() => setModalMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  introText: {
    flex: 1,
    color: '#888',
    fontSize: 12,
    lineHeight: 17,
  },
  introClose: {
    color: '#555',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#444',
    fontSize: 13,
  },
  list: {
    paddingTop: 8,
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  chainIconWrap: {
    width: 40,
    height: 34,
    justifyContent: 'flex-end',
  },
  chainIconTab: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 8,
    backgroundColor: '#3a3a5e',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chainIconBody: {
    width: 40,
    height: 28,
    backgroundColor: '#3a3a5e',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#555577',
  },
  chainInfo: {
    flex: 1,
    gap: 3,
  },
  chainName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  chainCount: {
    color: '#666',
    fontSize: 12,
  },
  actionBtn: {
    padding: 6,
  },
  actionIcon: {
    color: '#555',
    fontSize: 16,
  },
  chevron: {
    color: '#444',
    fontSize: 22,
    marginLeft: -4,
  },
  separator: {
    height: 1,
    backgroundColor: '#2a2a3e',
    marginHorizontal: 16,
  },
  fab: {
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
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
