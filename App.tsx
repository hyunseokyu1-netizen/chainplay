import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFolders } from './src/hooks/useFolders';
import { t } from './src/i18n';
import FolderListScreen from './src/screens/FolderListScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';

function AppContent() {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const {
    folders,
    isLoading,
    createFolder,
    renameFolder,
    deleteFolder,
    addUrlToFolder,
    removeItemFromFolder,
    moveItemInFolder,
    moveItemBetweenFolders,
  } = useFolders();

  const activeFolder = activeFolderId ? folders.find((f) => f.id === activeFolderId) ?? null : null;

  // 활성 폴더가 삭제된 경우 목록으로 복귀
  if (activeFolderId && !activeFolder) {
    setActiveFolderId(null);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {!activeFolder ? (
          <>
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoTriangle} />
                </View>
                <Text style={styles.headerTitle}>ChainPlay</Text>
              </View>
              <Text style={styles.headerSub}>{t.folderListTitle}</Text>
            </View>
            <FolderListScreen
              folders={folders}
              bottomInset={bottomInset}
              onSelectFolder={setActiveFolderId}
              onCreateFolder={createFolder}
              onRenameFolder={renameFolder}
              onDeleteFolder={deleteFolder}
            />
          </>
        ) : (
          <PlaylistScreen
            folder={activeFolder}
            allFolders={folders}
            isLoading={isLoading}
            bottomInset={bottomInset}
            onBack={() => setActiveFolderId(null)}
            onAddUrl={addUrlToFolder}
            onRemoveItem={removeItemFromFolder}
            onMoveItemInFolder={moveItemInFolder}
            onMoveItemBetweenFolders={moveItemBetweenFolders}
          />
        )}
      </SafeAreaView>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f0f1a',
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#03030a',
    borderWidth: 1.5,
    borderColor: '#00f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#00d8f0',
    marginLeft: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#666',
    fontSize: 13,
  },
});
