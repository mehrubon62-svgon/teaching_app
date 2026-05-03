import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Alert, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import { verifyOTP } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const { phone, otpCode } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Автозаполнение кода из API ответа
  useEffect(() => {
    if (otpCode) {
      setCode(otpCode);
      // Автоматическая верификация через 500мс
      const timer = setTimeout(() => handleVerify(otpCode), 500);
      return () => clearTimeout(timer);
    }
  }, [otpCode]);

  const handleVerify = async (overrideCode) => {
    const verifyCode = overrideCode || code;
    if (verifyCode.length < 4) {
      Alert.alert('Ошибка', 'Введите 4-значный код');
      return;
    }
    setLoading(true);
    try {
      const { data } = await verifyOTP(phone, verifyCode);
      await login(
        { access: data.access, refresh: data.refresh },
        data.user
      );
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.error || 'Неверный код');
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
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>📱</Text>
            </View>
          </View>

          <Text style={styles.title}>Введите код</Text>
          <Text style={styles.subtitle}>
            Мы отправили код на номер{'\n'}
            <Text style={styles.phoneHighlight}>{phone}</Text>
          </Text>

          <View style={styles.card}>
            <View style={styles.codeContainer}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.codeBox,
                    code.length === i && styles.codeBoxActive,
                    code.length > i && styles.codeBoxFilled,
                  ]}
                >
                  <Text style={styles.codeDigit}>{code[i] || ''}</Text>
                </View>
              ))}
            </View>

            <TextInput
              style={styles.hiddenInput}
              value={code}
              onChangeText={(text) => {
                const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
                setCode(digits);
                if (digits.length === 4) {
                  setTimeout(() => handleVerify(), 300);
                }
              }}
              keyboardType="number-pad"
              autoFocus
              maxLength={4}
            />

            <Button
              title="Подтвердить"
              onPress={handleVerify}
              loading={loading}
            />
          </View>

          <Text style={styles.resendHint}>Код действителен 5 минут</Text>
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
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F1F8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6C5CE715',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.body,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: '#6C5CE7',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    ...Shadows.large,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  codeBox: {
    width: 56,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F0F1F8',
    borderWidth: 2,
    borderColor: '#E0E1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE708',
  },
  codeBoxFilled: {
    borderColor: '#6C5CE7',
    backgroundColor: '#6C5CE712',
  },
  codeDigit: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D3436',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendHint: {
    ...Typography.small,
    color: '#B2BEC3',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default OTPScreen;
