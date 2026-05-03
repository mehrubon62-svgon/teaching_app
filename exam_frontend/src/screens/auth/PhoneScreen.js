import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import { sendOTP } from '../../api/auth';

const PhoneScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    if (cleaned.length < 7) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }
    setLoading(true);
    try {
      const res = await sendOTP(cleaned);
      console.log('OTP sent:', res.data);
      navigation.navigate('OTP', { phone: cleaned, otpCode: res.data.otp_code });
    } catch (e) {
      console.log('OTP error:', e.message, e.response?.data, e.code);
      const msg = e.message === 'Network Error'
        ? 'Нет связи с сервером. Проверьте подключение.'
        : e.response?.data?.error || e.message || 'Не удалось отправить код';
      Alert.alert('Ошибка', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🎓</Text>
            </View>
            <Text style={styles.logoText}>Omuz</Text>
            <Text style={styles.logoSub}>Образовательная платформа</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Вход в аккаунт</Text>
            <Text style={styles.cardSubtitle}>
              Введите номер телефона — мы отправим код подтверждения
            </Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Телефон</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+992 90 123 45 67"
                  placeholderTextColor="#B2BEC3"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoFocus
                />
              </View>
            </View>

            <Button
              title="Получить код"
              onPress={handleSend}
              loading={loading}
              style={styles.button}
            />
          </View>

          <Text style={styles.hint}>
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE715',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  logoSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    ...Shadows.large,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.body,
    color: '#636E72',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputWrap: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F1F8',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E0E1EA',
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3436',
  },
  button: {
    marginTop: 4,
  },
  hint: {
    ...Typography.small,
    color: '#B2BEC3',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PhoneScreen;
