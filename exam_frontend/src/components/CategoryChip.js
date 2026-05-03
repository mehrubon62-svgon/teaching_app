import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

const CategoryChip = ({ category, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.icon}>{category.icon}</Text>
    <Text style={[styles.name, selected && styles.nameSelected]}>
      {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
    gap: 4,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  icon: {
    fontSize: 16,
  },
  name: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  nameSelected: {
    color: Colors.textInverse,
  },
});

export default CategoryChip;
