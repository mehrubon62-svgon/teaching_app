import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

const XPBar = ({ current, max, level, showLabel = true }) => {
  const progress = max > 0 ? Math.min(current / max, 1) : 0;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.levelBadge}>Ур. {level}</Text>
          <Text style={styles.xpText}>{current} XP</Text>
        </View>
      )}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  levelBadge: {
    ...Typography.captionBold,
    color: Colors.primary,
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  xpText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.xpBarBg,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.xpBar,
    borderRadius: BorderRadius.round,
  },
});

export default XPBar;
