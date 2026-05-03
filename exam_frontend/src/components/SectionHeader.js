import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

const SectionHeader = ({ title, actionLabel, onAction, icon }) => (
  <View style={styles.container}>
    <View style={styles.titleWrap}>
      {icon && <Ionicons name={icon} size={20} color="#6C5CE7" />}
      <Text style={styles.title}>{title}</Text>
    </View>
    {actionLabel && onAction && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C5CE7',
  },
});

export default SectionHeader;
