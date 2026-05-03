import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

const LeaderboardItem = ({ item, rank }) => {
  const isTop3 = rank <= 3;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <View style={[styles.container, isTop3 && styles.topContainer]}>
      <View style={[styles.rankWrap, isTop3 && styles.rankWrapTop]}>
        <Text style={[styles.rank, isTop3 && styles.rankTop]}>
          {isTop3 ? medals[rank - 1] : rank}
        </Text>
      </View>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, isTop3 && styles.avatarTop]}>
          <Text style={styles.avatarText}>
            {(item.full_name || '?')[0]?.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.full_name || 'Аноним'}
        </Text>
        <Text style={styles.level}>Уровень {item.level}</Text>
      </View>
      <View style={styles.xpWrap}>
        <Text style={styles.xp}>{item.xp_points}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  topContainer: {
    backgroundColor: '#F8F5FF',
    borderWidth: 1,
    borderColor: Colors.primaryLight + '40',
  },
  rankWrap: {
    width: 32,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  rankWrapTop: {},
  rank: {
    ...Typography.bodyBold,
    color: Colors.textTertiary,
  },
  rankTop: {
    fontSize: 22,
  },
  avatarWrap: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTop: {
    backgroundColor: Colors.primaryLight + '30',
  },
  avatarText: {
    ...Typography.h5,
    color: Colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  level: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  xpWrap: {
    alignItems: 'flex-end',
  },
  xp: {
    ...Typography.h4,
    color: Colors.primary,
  },
  xpLabel: {
    ...Typography.small,
    color: Colors.textTertiary,
  },
});

export default LeaderboardItem;
