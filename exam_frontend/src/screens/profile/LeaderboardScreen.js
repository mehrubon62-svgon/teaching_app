import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import LeaderboardItem from '../../components/LeaderboardItem';
import { getLeaderboard } from '../../api/gamification';

const LeaderboardScreen = ({ navigation }) => {
  const [leaders, setLeaders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data } = await getLeaderboard();
      setLeaders(data);
    } catch (e) {
      console.log('Leaderboard error:', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Таблица лидеров</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Top 3 Podium */}
      {leaders.length >= 3 && (
        <View style={styles.podiumWrap}>
          {/* 2nd place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, styles.podiumSilver]}>
              <Text style={styles.podiumLetter}>
                {(leaders[1]?.full_name || '?')[0]?.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥈</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{leaders[1]?.full_name}</Text>
            <Text style={styles.podiumXP}>{leaders[1]?.xp_points} XP</Text>
          </View>
          {/* 1st place */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <View style={[styles.podiumAvatar, styles.podiumGold]}>
              <Text style={styles.podiumLetter}>
                {(leaders[0]?.full_name || '?')[0]?.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥇</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{leaders[0]?.full_name}</Text>
            <Text style={styles.podiumXP}>{leaders[0]?.xp_points} XP</Text>
          </View>
          {/* 3rd place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, styles.podiumBronze]}>
              <Text style={styles.podiumLetter}>
                {(leaders[2]?.full_name || '?')[0]?.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.podiumMedal}>🥉</Text>
            <Text style={styles.podiumName} numberOfLines={1}>{leaders[2]?.full_name}</Text>
            <Text style={styles.podiumXP}>{leaders[2]?.xp_points} XP</Text>
          </View>
        </View>
      )}

      {/* Rest of list */}
      <FlatList
        data={leaders.slice(3)}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        renderItem={({ item, index }) => (
          <LeaderboardItem item={item} rank={index + 4} />
        )}
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
  podiumWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  podiumFirst: {
    marginBottom: 20,
  },
  podiumAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  podiumGold: {
    backgroundColor: '#FDCB6E40',
    borderWidth: 2,
    borderColor: '#FDCB6E',
  },
  podiumSilver: {
    backgroundColor: '#B2BEC340',
    borderWidth: 2,
    borderColor: '#B2BEC3',
  },
  podiumBronze: {
    backgroundColor: '#E1705540',
    borderWidth: 2,
    borderColor: '#E17055',
  },
  podiumLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  podiumMedal: { fontSize: 24, marginBottom: 2 },
  podiumName: {
    ...Typography.captionBold,
    color: Colors.text,
    textAlign: 'center',
  },
  podiumXP: {
    ...Typography.small,
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
});

export default LeaderboardScreen;
