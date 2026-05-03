import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, Linking, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import { getLessonDetail, completeLesson } from '../../api/courses';

const LessonDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [lesson, setLesson] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      const { data } = await getLessonDetail(id);
      setLesson(data);
      setIsCompleted(data.is_completed);
    } catch (e) {
      if (e.response?.status === 403) {
        Alert.alert('Заблокировано', e.response.data.error || 'Сначала пройдите тест');
        navigation.goBack();
      }
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const { data } = await completeLesson(id);
      setIsCompleted(true);
      setXpEarned(data.xp_earned);
      Alert.alert('Урок завершён! 🎉', `+${data.xp_earned} XP начислено!`);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось завершить урок');
    } finally {
      setCompleting(false);
    }
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingIcon}>⏳</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Video Area */}
        {lesson.video_url ? (
          <TouchableOpacity
            style={styles.videoArea}
            onPress={() => Linking.openURL(lesson.video_url)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientDarkStart, Colors.gradientDarkEnd]}
              style={styles.videoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.playBtn}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <Text style={styles.videoLabel}>
                {lesson.video_type === 'youtube' ? '🎥 Смотреть на YouTube' : '🔗 Открыть видео'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.noVideo}>
            <Text style={styles.noVideoIcon}>📝</Text>
            <Text style={styles.noVideoText}>Текстовый урок</Text>
          </View>
        )}

        {/* Lesson Info */}
        <View style={styles.infoSection}>
          <View style={styles.xpReward}>
            <Text style={styles.xpRewardText}>+{lesson.xp_reward} XP</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
          {lesson.description ? (
            <Text style={styles.description}>{lesson.description}</Text>
          ) : null}

          {/* Attachments */}
          {lesson.attachments?.length > 0 && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.attachmentsTitle}>📎 Материалы</Text>
              {lesson.attachments.map((att) => (
                <TouchableOpacity
                  key={att.id}
                  style={styles.attachmentItem}
                  onPress={() => Linking.openURL(att.file)}
                >
                  <Text style={styles.attachmentIcon}>📄</Text>
                  <Text style={styles.attachmentName} numberOfLines={1}>{att.title}</Text>
                  <Text style={styles.attachmentAction}>Открыть →</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Complete Button */}
          {isCompleted ? (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✅ Урок пройден! +{xpEarned || lesson.xp_reward} XP</Text>
            </View>
          ) : (
            <Button
              title="Завершить урок"
              icon="✓"
              onPress={handleComplete}
              loading={completing}
              style={styles.completeBtn}
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: { fontSize: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    ...Typography.h4,
    color: Colors.text,
  },
  headerTitle: {
    ...Typography.h5,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  videoArea: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  videoGradient: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  playIcon: {
    fontSize: 28,
    color: Colors.textInverse,
    marginLeft: 4,
  },
  videoLabel: {
    ...Typography.captionBold,
    color: Colors.textInverse + 'CC',
  },
  noVideo: {
    marginHorizontal: Spacing.xl,
    height: 120,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoIcon: { fontSize: 36, marginBottom: Spacing.xs },
  noVideoText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  infoSection: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  xpReward: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  xpRewardText: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  attachmentsSection: {
    marginBottom: Spacing.lg,
  },
  attachmentsTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  attachmentIcon: { fontSize: 20, marginRight: Spacing.sm },
  attachmentName: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    fontSize: 14,
  },
  attachmentAction: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  completeBtn: {
    marginTop: Spacing.sm,
  },
  completedBadge: {
    backgroundColor: '#E8F8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  completedText: {
    ...Typography.bodyBold,
    color: Colors.secondary,
  },
});

export default LessonDetailScreen;
