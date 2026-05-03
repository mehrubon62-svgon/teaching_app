import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import CourseCard from '../../components/CourseCard';
import CategoryChip from '../../components/CategoryChip';
import { getCourses, getCategories } from '../../api/courses';

const CourseListScreen = ({ navigation, route }) => {
  const { categoryId, categoryName, search, popular, promoted } = route.params || {};
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(categoryId || null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const title = promoted ? 'Скидки и акции' : popular ? 'Популярные' : categoryName || 'Все курсы';

  const loadCourses = useCallback(async () => {
    try {
      const params = {};
      if (selectedCat) params.category = selectedCat;
      if (search) params.search = search;
      if (popular) params.popular = 'true';
      if (promoted) params.promoted = 'true';
      const { data } = await getCourses(params);
      setCourses(data);
    } catch (e) {
      console.log('CourseList error:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, search, popular, promoted]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      const all = [...data.occupations, ...data.school_subjects];
      setCategories(all);
    } catch (e) {}
  };

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          <CategoryChip
            category={{ id: null, name: 'Все', icon: '🌐' }}
            selected={selectedCat === null}
            onPress={() => setSelectedCat(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              selected={selectedCat === cat.id}
              onPress={() => setSelectedCat(cat.id)}
            />
          ))}
        </ScrollView>
      )}

      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            horizontal={false}
            onPress={() => navigation.navigate('CourseDetail', { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Курсы не найдены</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  title: {
    ...Typography.h4,
    color: Colors.text,
  },
  catScroll: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    maxHeight: 50,
  },
  row: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
});

export default CourseListScreen;
