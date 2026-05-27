import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Chain, PlaylistItem } from '../types';
import { t } from '../i18n';

interface Props {
  visible: boolean;
  item: PlaylistItem | null;
  chains: Chain[];
  currentChainId: string;
  bottomInset: number;
  onMove: (toChainId: string) => void;
  onClose: () => void;
}

export default function MoveToChainModal({
  visible,
  item,
  chains,
  currentChainId,
  bottomInset,
  onMove,
  onClose,
}: Props) {
  const otherChains = chains.filter((c) => c.id !== currentChainId);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: 24 + bottomInset }]}>
        <Text style={styles.title}>{t.moveToChain}</Text>
        {item && (
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
        )}
        {otherChains.length === 0 ? (
          <Text style={styles.empty}>{t.noOtherChains}</Text>
        ) : (
          <FlatList
            data={otherChains}
            keyExtractor={(c) => c.id}
            style={styles.list}
            renderItem={({ item: chain }) => (
              <TouchableOpacity
                style={styles.chainRow}
                onPress={() => {
                  onMove(chain.id);
                  onClose();
                }}
              >
                <View style={styles.chainIcon} />
                <View style={styles.chainInfo}>
                  <Text style={styles.chainName}>{chain.name}</Text>
                  <Text style={styles.chainCount}>
                    {t.chainVideoCount(chain.items.length)}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>{t.cancel}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 20,
    maxHeight: '60%',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemTitle: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
  list: {
    flexGrow: 0,
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  chainIcon: {
    width: 36,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#3a3a5e',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#555577',
  },
  chainInfo: {
    flex: 1,
    gap: 2,
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
  arrow: {
    color: '#555',
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#2a2a3e',
  },
  empty: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  cancelBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#2a2a3e',
    alignItems: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },
});
