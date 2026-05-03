import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import XPBar from '../../components/XPBar';
import BadgeItem from '../../components/BadgeItem';
import { useAuth } from '../../context/AuthContext';
import { getGameProfile } from '../../api/gamification';
import { getProfile } from '../../api/auth';
import { BASE_URL } from '../../api/client';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [gameProfile, setGameProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, gameRes] = await Promise.all([getProfile(), getGameProfile()]);
      updateUser(profileRes.data);
      setGameProfile(gameRes.data);
    } catch (e) {
      console.log('Profile load error:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: logout },
    ]);
  };

  const avatarUri = user?.avatar ? `${BASE_URL}${user.avatar}` : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>
                  {(user?.full_name || user?.phone_number || '?')[0]?.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user?.full_name || 'Без имени'}</Text>
          <View style={styles.roleTag}>
            <Ionicons
              name={user?.role === 'student' ? 'school-outline' : user?.role === 'teacher' ? 'create-outline' : 'shield-checkmark-outline'}
              size={14}
              color="#6C5CE7"
            />
            <Text style={styles.roleText}>
              {user?.role === 'student' ? 'Студент' : user?.role === 'teacher' ? 'Учитель' : 'Модератор'}
            </Text>
          </View>
          <Text style={styles.userPhone}>{user?.phone_number}</Text>
        </View>

        {/* Game Profile Card */}
        {gameProfile && (
          <View style={styles.gameCard}>
            <View style={styles.gameStatsRow}>
              <View style={styles.gameStat}>
                <Ionicons name="star" size={16} color="#FDCB6E" />
                <Text style={styles.gameStatValue}>{gameProfile.xp_points}</Text>
                <Text style={styles.gameStatLabel}>XP</Text>
              </View>
              <View style={styles.gameStatDivider} />
              <View style={styles.gameStat}>
                <Ionicons name="arrow-up-circle" size={16} color="#6C5CE7" />
                <Text style={styles.gameStatValue}>{gameProfile.level}</Text>
                <Text style={styles.gameStatLabel}>Уровень</Text>
              </View>
              <View style={styles.gameStatDivider} />
              <View style={styles.gameStat}>
                <Ionicons name="flame" size={16} color="#E17055" />
                <Text style={styles.gameStatValue}>{gameProfile.streak_days}</Text>
                <Text style={styles.gameStatLabel}>Стрик</Text>
              </View>
            </View>
            <XPBar
              current={gameProfile.xp_points % 100}
              max={100}
              level={gameProfile.level}
            />
          </View>
        )}

        {/* Badges */}
        {gameProfile?.user_badges?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="ribbon-outline" size={20} color="#2D3436" />
              <Text style={styles.sectionTitle}>Бейджи</Text>
            </View>
            {gameProfile.user_badges.map((ub, i) => (
              <BadgeItem key={i} badge={ub.badge} earnedAt={ub.earned_at} index={i} />
            ))}
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="settings-outline" size={20} color="#2D3436" />
            <Text style={styles.sectionTitle}>Меню</Text>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Leaderboard')}>
            <Ionicons name="trophy-outline" size={22} color="#6C5CE7" />
            <Text style={styles.menuLabel}>Таблица лидеров</Text>
            <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Resume')}>
            <Ionicons name="document-text-outline" size={22} color="#6C5CE7" />
            <Text style={styles.menuLabel}>Моё резюме</Text>
            <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#6C5CE7" />
            <Text style={styles.menuLabel}>Уведомления</Text>
            <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyCourses')}>
            <Ionicons name="book-outline" size={22} color="#6C5CE7" />
            <Text style={styles.menuLabel}>Мои курсы</Text>
            <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <Button title="Выйти" variant="danger" onPress={handleLogout} />
        </View>

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
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 32,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarWrap: {
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6C5CE730',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6C5CE715',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#6C5CE730',
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE712',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  userPhone: {
    fontSize: 13,
    color: '#636E72',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  gameStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  gameStat: {
    alignItems: 'center',
    gap: 2,
  },
  gameStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  gameStatLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  gameStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E1EA',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#2D3436',
    flex: 1,
  },
  logoutWrap: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
});

export default ProfileScreen;
