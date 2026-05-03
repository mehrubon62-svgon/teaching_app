import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import { getResume, updateResume } from '../../api/resume';

const ResumeScreen = ({ navigation }) => {
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    bio: '',
    skills: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const { data } = await getResume();
      setResume(data);
      setForm({
        full_name: data.full_name || '',
        bio: data.bio || '',
        skills: data.skills || '',
        phone: data.phone || '',
        email: data.email || '',
      });
    } catch (e) {
      console.log('Resume error:', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateResume(form);
      setResume(data);
      Alert.alert('Сохранено', 'Резюме обновлено ✅');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Моё резюме 📄</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>👤 Полное имя</Text>
            <TextInput
              style={styles.input}
              value={form.full_name}
              onChangeText={(t) => setForm({ ...form, full_name: t })}
              placeholder="Алишер Навоий"
              placeholderTextColor={Colors.textTertiary}
            />

            <Text style={styles.fieldLabel}>📝 О себе</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.bio}
              onChangeText={(t) => setForm({ ...form, bio: t })}
              placeholder="Full-stack разработчик с 2 годами опыта..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.fieldLabel}>🛠 Навыки (через запятую)</Text>
            <TextInput
              style={styles.input}
              value={form.skills}
              onChangeText={(t) => setForm({ ...form, skills: t })}
              placeholder="Python, Django, React, PostgreSQL"
              placeholderTextColor={Colors.textTertiary}
            />

            <Text style={styles.fieldLabel}>📞 Телефон</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
              placeholder="+998901234567"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>✉️ Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              placeholder="alisher@example.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              title="Сохранить резюме"
              onPress={handleSave}
              loading={saving}
              style={styles.saveBtn}
            />
          </View>

          {/* Completed Courses */}
          {resume?.completed_courses?.length > 0 && (
            <View style={styles.coursesCard}>
              <Text style={styles.coursesTitle}>📚 Пройденные курсы</Text>
              {resume.completed_courses.map((title, i) => (
                <View key={i} style={styles.courseItem}>
                  <Text style={styles.courseBullet}>•</Text>
                  <Text style={styles.courseName}>{title}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: { flex: 1 },
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
  formCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  fieldLabel: {
    ...Typography.bodyBold,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: Spacing.xl,
  },
  coursesCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  coursesTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  courseBullet: {
    ...Typography.body,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  courseName: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
});

export default ResumeScreen;
