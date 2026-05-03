import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

const BADGE_COLORS = [
  [Colors.badge1, Colors.primaryLight],
  [Colors.badge2, '#55EFC4'],
  [Colors.badge3, '#FDCB6E'],
  [Colors.badge4, '#FFEAA7'],
  [Colors.badge5, '#A29BFE'],
  [Colors.badge6, '#FAB1A0'],
];

const BadgeItem = ({ badge, earnedAt, index = 0 }) => {
  const colors = BADGE_COLORS[index % BADGE_COLORS.length];

  return (
    <View style={[styles.container, Shadows.small]}>
      <LinearGradient
        colors={colors}
        style={styles.iconWrap}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.icon}>{badge.icon}</Text>
      </LinearGradient>
      <View style={styles.info}>
        <Text style={styles.name}>{badge.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{badge.description}</Text>
        {earnedAt && (
          <Text style={styles.earnedAt}>
            Получен {new Date(earnedAt).toLocaleDateString('ru-RU')}
          </Text>
        )}
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
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 26,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  earnedAt: {
    ...Typography.small,
    color: Colors.primary,
    marginTop: 2,
  },
});

export default BadgeItem;
