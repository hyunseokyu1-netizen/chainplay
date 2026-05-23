import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Folder, PlaylistItem } from '../types';
import { t } from '../i18n';

interface Props {
  visible: boolean;
  item: PlaylistItem | null;
  folders: Folder[];
  currentFolderId: string;
  bottomInset: number;
  onMove: (toFolderId: string) => void;
  onClose: () => void;
}

export default function MoveToFolderModal({
  visible,
  item,
  folders,
  currentFolderId,
  bottomInset,
  onMove,
  onClose,
}: Props) {
  const otherFolders = folders.filter((f) => f.id !== currentFolderId);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: 24 + bottomInset }]}>
        <Text style={styles.title}>{t.moveToFolder}</Text>
        {item && (
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
        )}
        {otherFolders.length === 0 ? (
          <Text style={styles.empty}>{t.noOtherFolders}</Text>
        ) : (
          <FlatList
            data={otherFolders}
            keyExtractor={(f) => f.id}
            style={styles.list}
            renderItem={({ item: folder }) => (
              <TouchableOpacity
                style={styles.folderRow}
                onPress={() => {
                  onMove(folder.id);
                  onClose();
                }}
              >
                <View style={styles.folderIcon} />
                <View style={styles.folderInfo}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderCount}>
                    {t.folderVideoCount(folder.items.length)}
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
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  folderIcon: {
    width: 36,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#3a3a5e',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#555577',
  },
  folderInfo: {
    flex: 1,
    gap: 2,
  },
  folderName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  folderCount: {
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
