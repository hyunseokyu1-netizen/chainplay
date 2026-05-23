import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Folder } from '../types';
import { t } from '../i18n';
import FolderNameModal from '../components/FolderNameModal';

interface Props {
  folders: Folder[];
  bottomInset: number;
  onSelectFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
}

export default function FolderListScreen({
  folders,
  bottomInset,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}: Props) {
  const [modalMode, setModalMode] = useState<'create' | 'rename' | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const openCreate = () => {
    setEditingFolder(null);
    setModalMode('create');
  };

  const openRename = (folder: Folder) => {
    setEditingFolder(folder);
    setModalMode('rename');
  };

  const handleConfirm = (name: string) => {
    if (modalMode === 'create') {
      onCreateFolder(name);
    } else if (modalMode === 'rename' && editingFolder) {
      onRenameFolder(editingFolder.id, name);
    }
  };

  const handleDelete = (folder: Folder) => {
    Alert.alert('', t.deleteFolderConfirm(folder.name), [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: () => onDeleteFolder(folder.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.noFolders}</Text>
          <Text style={styles.emptyHint}>{t.noFoldersHint}</Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(f) => f.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: folder }) => (
            <TouchableOpacity
              style={styles.folderRow}
              onPress={() => onSelectFolder(folder.id)}
              activeOpacity={0.7}
            >
              <View style={styles.folderIconWrap}>
                <View style={styles.folderIconTab} />
                <View style={styles.folderIconBody} />
              </View>
              <View style={styles.folderInfo}>
                <Text style={styles.folderName} numberOfLines={1}>
                  {folder.name}
                </Text>
                <Text style={styles.folderCount}>
                  {t.folderVideoCount(folder.items.length)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openRename(folder)}
                hitSlop={8}
              >
                <Text style={styles.actionIcon}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDelete(folder)}
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
        <Text style={styles.fabText}>{t.newFolder}</Text>
      </TouchableOpacity>

      <FolderNameModal
        visible={modalMode !== null}
        mode={modalMode ?? 'create'}
        initialName={editingFolder?.name ?? ''}
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
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  folderIconWrap: {
    width: 40,
    height: 34,
    justifyContent: 'flex-end',
  },
  folderIconTab: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 8,
    backgroundColor: '#3a3a5e',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  folderIconBody: {
    width: 40,
    height: 28,
    backgroundColor: '#3a3a5e',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#555577',
  },
  folderInfo: {
    flex: 1,
    gap: 3,
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
