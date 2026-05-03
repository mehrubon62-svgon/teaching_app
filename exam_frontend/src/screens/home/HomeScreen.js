import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import CourseCard from '../../components/CourseCard';
import CategoryChip from '../../components/CategoryChip';
import SectionHeader from '../../components/SectionHeader';
import { getHome, getCategories } from '../../api/courses';

const HomeScreen = ({ navigation }) => {
  const [homeData, setHomeData] = useState(null);
  const [categories, setCategories] = useState({ occupations: [], school_subjects: [] });
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [homeRes, catRes] = await Promise.all([getHome(), getCategories()]);
      setHomeData(homeRes.data);
      setCategories(catRes.data);
    } catch (e) {
      console.log('Home load error:', e);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const allCategories = [...categories.occupations, ...categories.school_subjects];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Здравствуйте! 👋</Text>
            <Text style={styles.appName}>Omuz</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#2D3436" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#B2BEC3" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск курсов..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => navigation.navigate('CourseList', { search })}
          />
        </View>

        {/* Categories */}
        {allCategories.length > 0 && (
          <View style={styles.categoriesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allCategories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  onPress={() => navigation.navigate('CourseList', { categoryId: cat.id, categoryName: cat.name })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Continue Learning */}
        {homeData?.continue_learning?.length > 0 && (
          <>
            <SectionHeader
              title="Продолжить обучение"
              icon="book-outline"
              actionLabel="Все"
              onAction={() => navigation.navigate('MyCourses')}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {homeData.continue_learning.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Popular */}
        {homeData?.popular_courses?.length > 0 && (
          <>
            <SectionHeader
              title="Популярные курсы"
              icon="flame-outline"
              actionLabel="Ещё"
              onAction={() => navigation.navigate('CourseList', { popular: true })}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {homeData.popular_courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Promoted */}
        {homeData?.promoted_courses?.length > 0 && (
          <>
            <SectionHeader
              title="Скидки и акции"
              icon="pricetag-outline"
              actionLabel="Ещё"
              onAction={() => navigation.navigate('CourseList', { promoted: true })}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {homeData.promoted_courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Recommended */}
        {homeData?.recommended?.length > 0 && (
          <>
            <SectionHeader
              title="Рекомендуем"
              icon="sparkles-outline"
              actionLabel="Ещё"
              onAction={() => navigation.navigate('CourseList')}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {homeData.recommended.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => navigation.navigate('CourseDetail', { id: course.id })}
                />
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#636E72',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  notifIcon: {
    fontSize: 20,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
  },
  categoriesSection: {
    marginTop: 16,
    paddingLeft: 20,
  },
  carousel: {
    paddingLeft: 20,
    paddingRight: 12,
  },
});

export default HomeScreen;
