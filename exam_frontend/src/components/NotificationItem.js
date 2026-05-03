import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

const NOTIFICATION_ICONS = {
  course_update: '📢',
  discount: '🏷️',
  reminder: '⏰',
  achievement: '🏆',
};

const NotificationItem = ({ notification, onPress }) => (
  <TouchableOpacity
    style={[styles.container, !notification.is_read && styles.unread, Shadows.card]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconWrap, !notification.is_read && styles.iconWrapUnread]}>
      <Text style={styles.icon}>
        {NOTIFICATION_ICONS[notification.notification_type] || '🔔'}
      </Text>
    </View>
    <View style={styles.info}>
      <Text style={[styles.title, !notification.is_read && styles.titleUnread]} numberOfLines={1}>
        {notification.title}
      </Text>
      <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
      <Text style={styles.time}>
        {new Date(notification.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        })}
      </Text>
    </View>
    {!notification.is_read && <View style={styles.dot} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  unread: {
    backgroundColor: '#F0EDFF',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconWrapUnread: {
    backgroundColor: '#E8E4FF',
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  titleUnread: {
    ...Typography.captionBold,
    color: Colors.text,
  },
  message: {
    ...Typography.caption,
    color: Colors.text,
    lineHeight: 18,
  },
  time: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
});

export default NotificationItem;
