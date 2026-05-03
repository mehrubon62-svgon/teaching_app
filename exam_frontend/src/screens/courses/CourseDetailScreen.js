import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, Alert, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import ModuleItem from '../../components/ModuleItem';
import { getCourseDetail, enrollCourse } from '../../api/courses';
import { BASE_URL } from '../../api/client';

const CourseDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const { data } = await getCourseDetail(id);
      setCourse(data);
    } catch (e) {
      console.log('Course detail error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollCourse(id);
      Alert.alert('Успешно', 'Вы записались на курс!');
      loadCourse();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.error || 'Не удалось записаться');
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingIcon}>⏳</Text>
        </View>
      </SafeAreaView>
    );
  }

  const thumbnailUri = course.thumbnail ? `${BASE_URL}${course.thumbnail}` : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageWrap}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.imagePlaceholder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.imageEmoji}>📚</Text>
            </LinearGradient>
          )}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          {course.has_discount && (
            <View style={styles.discountBanner}>
              <Text style={styles.discountBannerText}>🏷️ Скидка!</Text>
            </View>
          )}
        </View>

        {/* Course Info */}
        <View style={styles.infoSection}>
          {course.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {course.category.icon} {course.category.name}
              </Text>
            </View>
          )}
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👨‍🏫</Text>
              <Text style={styles.metaText}>{course.instructor_name || 'Не указан'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>{course.enrolled_count} студентов</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            {course.has_discount ? (
              <View style={styles.priceWrap}>
                <Text style={styles.price}>
                  {Number(course.discount_price).toLocaleString('ru-RU')} сомони
                </Text>
                <Text style={styles.priceOld}>
                  {Number(course.price).toLocaleString('ru-RU')} сомони
                </Text>
              </View>
            ) : course.price > 0 ? (
              <Text style={styles.price}>
                {Number(course.price).toLocaleString('ru-RU')} сомони
              </Text>
            ) : (
              <Text style={styles.priceFree}>Бесплатно</Text>
            )}
          </View>

          {/* Enroll Button */}
          {!course.is_enrolled && (
            <Button
              title="Записаться на курс"
              onPress={handleEnroll}
              loading={enrolling}
              style={styles.enrollBtn}
            />
          )}
          {course.is_enrolled && (
            <View style={styles.enrolledBadge}>
              <Text style={styles.enrolledBadgeText}>✅ Вы записаны на этот курс</Text>
            </View>
          )}
        </View>

        {/* Modules */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>📋 Программа курса</Text>
          {course.modules?.map((mod) => (
            <ModuleItem
              key={mod.id}
              module={mod}
              onLessonPress={(lesson) =>
                navigation.navigate('LessonDetail', { id: lesson.id })
              }
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
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
  imageWrap: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: { fontSize: 56 },
  backBtn: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    ...Typography.h4,
    color: Colors.textInverse,
  },
  discountBanner: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  discountBannerText: {
    ...Typography.captionBold,
    color: Colors.textInverse,
  },
  infoSection: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    marginTop: -Spacing.xxl,
    padding: Spacing.xl,
    ...Shadows.medium,
  },
  categoryTag: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  categoryTagText: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaIcon: { fontSize: 18 },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceRow: {
    marginBottom: Spacing.lg,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  price: {
    ...Typography.price,
    color: Colors.primary,
  },
  priceOld: {
    ...Typography.priceOld,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  priceFree: {
    ...Typography.price,
    color: Colors.secondary,
  },
  enrollBtn: {
    marginTop: Spacing.sm,
  },
  enrolledBadge: {
    backgroundColor: '#E8F8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  enrolledBadgeText: {
    ...Typography.bodyBold,
    color: Colors.secondary,
  },
  modulesSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
});

export default CourseDetailScreen;
