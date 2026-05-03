import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

const ModuleItem = ({ module, lessonProgress, onLessonPress }) => {
  const totalLessons = module.lessons?.length || 0;
  const completedLessons = module.lessons?.filter(
    (l) => lessonProgress?.[l.id]?.is_completed
  ).length || 0;
  const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.moduleTitle} numberOfLines={1}>{module.title}</Text>
        <Text style={styles.progressText}>
          {completedLessons}/{totalLessons}
        </Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.lessonsList}>
        {module.lessons?.map((lesson) => {
          const isCompleted = lessonProgress?.[lesson.id]?.is_completed;
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonItem,
                isCompleted && styles.lessonCompleted,
                lesson.is_locked && styles.lessonLocked,
              ]}
              onPress={() => !lesson.is_locked && onLessonPress?.(lesson)}
              disabled={lesson.is_locked}
              activeOpacity={0.7}
            >
              <View style={styles.lessonIconWrap}>
                {lesson.is_locked ? (
                  <Text style={styles.lessonIcon}>🔒</Text>
                ) : isCompleted ? (
                  <Text style={styles.lessonIcon}>✅</Text>
                ) : (
                  <Text style={styles.lessonIcon}>▶️</Text>
                )}
              </View>
              <View style={styles.lessonInfo}>
                <Text
                  style={[
                    styles.lessonTitle,
                    lesson.is_locked && styles.lessonTitleLocked,
                  ]}
                  numberOfLines={1}
                >
                  {lesson.title}
                </Text>
                <Text style={styles.lessonMeta}>
                  {lesson.video_type === 'youtube' ? '🎥 Видео' : '🔗 Ссылка'} • +{lesson.xp_reward} XP
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  moduleTitle: {
    ...Typography.h5,
    color: Colors.text,
    flex: 1,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.xpBarBg,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
  },
  lessonsList: {
    gap: Spacing.xs,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceVariant,
  },
  lessonCompleted: {
    backgroundColor: '#E8F8F0',
  },
  lessonLocked: {
    opacity: 0.5,
  },
  lessonIconWrap: {
    marginRight: Spacing.md,
  },
  lessonIcon: {
    fontSize: 18,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    ...Typography.body,
    color: Colors.text,
    fontSize: 14,
  },
  lessonTitleLocked: {
    color: Colors.textTertiary,
  },
  lessonMeta: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginTop: 1,
  },
});

export default ModuleItem;
