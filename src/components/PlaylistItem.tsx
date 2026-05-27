import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PlaylistItem as Item } from '../types';

interface Props {
  item: Item;
  index: number;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToChain?: () => void;
}

export default function PlaylistItemRow({
  item,
  index,
  isCurrent,
  isFirst,
  isLast,
  onPress,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveToChain,
}: Props) {
  return (
    <View style={[styles.container, isCurrent && styles.current]}>
      <View style={styles.moveButtons}>
        <TouchableOpacity
          style={[styles.moveBtn, isFirst && styles.disabled]}
          onPress={onMoveUp}
          disabled={isFirst}
          hitSlop={4}
        >
          <Text style={styles.moveIcon}>▲</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.moveBtn, isLast && styles.disabled]}
          onPress={onMoveDown}
          disabled={isLast}
          hitSlop={4}
        >
          <Text style={styles.moveIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.info} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.textBlock}>
          <Text style={[styles.title, isCurrent && styles.currentTitle]} numberOfLines={2}>
            {isCurrent ? '▶ ' : `${index + 1}. `}
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>

      {onMoveToChain && (
        <TouchableOpacity style={styles.moveToChainBtn} onPress={onMoveToChain} hitSlop={8}>
          <Text style={styles.moveToChainIcon}>↗</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} hitSlop={8}>
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#1e1e2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  current: {
    borderLeftWidth: 3,
    borderLeftColor: '#ff0000',
  },
  moveButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
    gap: 2,
  },
  moveBtn: {
    padding: 4,
  },
  moveIcon: {
    color: '#555',
    fontSize: 12,
  },
  disabled: {
    opacity: 0.2,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumbnail: {
    width: 64,
    height: 42,
    borderRadius: 5,
    backgroundColor: '#2a2a3e',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  currentTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  moveToChainBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  moveToChainIcon: {
    color: '#555',
    fontSize: 16,
  },
  deleteBtn: {
    paddingLeft: 6,
    paddingVertical: 4,
  },
  deleteIcon: {
    color: '#666',
    fontSize: 16,
  },
});
