import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { BASE_URL } from '../api/client';

const CourseCard = ({ course, onPress, horizontal = false }) => {
  const thumbnailUri = course.thumbnail
    ? `${BASE_URL}${course.thumbnail}`
    : null;

  return (
    <TouchableOpacity
      style={[horizontal ? styles.horizontalCard : styles.verticalCard, Shadows.card]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={horizontal ? styles.horizontalThumbWrap : styles.verticalThumbWrap}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="book" size={32} color="#6C5CE780" />
          </View>
        )}
        {course.has_discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Скидка</Text>
          </View>
        )}
        {course.is_popular && !course.has_discount && (
          <View style={styles.popularBadge}>
            <Ionicons name="flame" size={10} color="#FFFFFF" />
            <Text style={styles.popularText}>Хит</Text>
          </View>
        )}
      </View>
      <View style={horizontal ? styles.horizontalInfo : styles.verticalInfo}>
        {course.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{course.category.name}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        {course.instructor_name && (
          <Text style={styles.instructor} numberOfLines={1}>{course.instructor_name}</Text>
        )}
        <View style={styles.bottomRow}>
          <View style={styles.priceWrap}>
            {course.has_discount ? (
              <>
                <Text style={styles.price}>
                  {Number(course.discount_price).toLocaleString('ru-RU')} сомони
                </Text>
                <Text style={styles.priceOld}>
                  {Number(course.price).toLocaleString('ru-RU')} сомони
                </Text>
              </>
            ) : course.price > 0 ? (
              <Text style={styles.price}>
                {Number(course.price).toLocaleString('ru-RU')} сомони
              </Text>
            ) : (
              <Text style={styles.priceFree}>Бесплатно</Text>
            )}
          </View>
          <View style={styles.enrolledWrap}>
            <Ionicons name="people-outline" size={12} color="#636E72" />
            <Text style={styles.enrolledText}>{course.enrolled_count || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  horizontalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 12,
  },
  verticalThumbWrap: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  horizontalThumbWrap: {
    width: 110,
    height: '100%',
    minHeight: 110,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6C5CE712',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E17055',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  verticalInfo: {
    padding: 12,
  },
  horizontalInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  categoryTag: {
    backgroundColor: '#6C5CE712',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryTagText: {
    fontSize: 11,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  instructor: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  priceOld: {
    fontSize: 11,
    color: '#B2BEC3',
    textDecorationLine: 'line-through',
  },
  priceFree: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00B894',
  },
  enrolledWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  enrolledText: {
    fontSize: 11,
    color: '#636E72',
  },
});

export default CourseCard;
