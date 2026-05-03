import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import Button from '../../components/Button';
import { getQuiz, submitQuiz } from '../../api/quizzes';

const QuizScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      const { data } = await getQuiz(id);
      setQuiz(data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить тест');
      navigation.goBack();
    }
  };

  const selectAnswer = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    const totalQuestions = quiz.questions?.length || 0;
    const answered = Object.keys(answers).length;
    if (answered < totalQuestions) {
      Alert.alert('Внимание', `Вы ответили на ${answered} из ${totalQuestions} вопросов. Продолжить?`, [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Отправить', onPress: doSubmit },
      ]);
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setSubmitting(true);
    try {
      const stringAnswers = {};
      Object.entries(answers).forEach(([k, v]) => { stringAnswers[k] = v; });
      const { data } = await submitQuiz(id, stringAnswers);
      setResult(data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось отправить ответы');
    } finally {
      setSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingIcon}>⏳</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={styles.resultIconWrap}>
            <Text style={styles.resultIcon}>{result.passed ? '🎉' : '😔'}</Text>
          </View>
          <Text style={styles.resultTitle}>
            {result.passed ? 'Тест пройден!' : 'Не пройден'}
          </Text>
          <LinearGradient
            colors={result.passed
              ? [Colors.gradientGreenStart, Colors.gradientGreenEnd]
              : [Colors.gradientPinkStart, Colors.gradientPinkEnd]}
            style={styles.scoreCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.scoreValue}>{Math.round(result.score)}%</Text>
          </LinearGradient>
          <Text style={styles.scoreDetail}>
            {result.correct} из {result.total} правильно
          </Text>
          {result.passed && result.xp_earned > 0 && (
            <View style={styles.xpEarned}>
              <Text style={styles.xpEarnedText}>+{result.xp_earned} XP начислено! ⚡</Text>
            </View>
          )}
          <Text style={styles.resultMessage}>{result.message}</Text>
          <Button
            title="Вернуться к курсу"
            onPress={() => navigation.goBack()}
            style={styles.resultBtn}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const questions = quiz.questions || [];
  const question = questions[currentQ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{quiz.title}</Text>
        <Text style={styles.counter}>{currentQ + 1}/{questions.length}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question?.text}</Text>
        </View>

        {/* Answers */}
        <View style={styles.answersWrap}>
          {question?.answers?.map((answer) => {
            const isSelected = answers[question.id] === answer.id;
            return (
              <TouchableOpacity
                key={answer.id}
                style={[styles.answerItem, isSelected && styles.answerSelected]}
                onPress={() => selectAnswer(question.id, answer.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.answerRadio, isSelected && styles.answerRadioSelected]}>
                  {isSelected && <View style={styles.answerRadioDot} />}
                </View>
                <Text style={[styles.answerText, isSelected && styles.answerTextSelected]}>
                  {answer.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Button
            title="← Назад"
            variant="outline"
            size="sm"
            onPress={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            style={styles.navBtn}
          />
          {currentQ < questions.length - 1 ? (
            <Button
              title="Далее →"
              size="sm"
              onPress={() => setCurrentQ(currentQ + 1)}
              style={styles.navBtn}
            />
          ) : (
            <Button
              title="Завершить тест"
              icon="✓"
              size="sm"
              onPress={handleSubmit}
              loading={submitting}
              style={styles.navBtn}
            />
          )}
        </View>

        {/* Question dots */}
        <View style={styles.dotsRow}>
          {questions.map((q, i) => (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.dot,
                i === currentQ && styles.dotCurrent,
                answers[q.id] && styles.dotAnswered,
              ]}
              onPress={() => setCurrentQ(i)}
            />
          ))}
        </View>
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
    marginHorizontal: Spacing.sm,
  },
  counter: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  progressBg: {
    height: 4,
    backgroundColor: Colors.xpBarBg,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    ...Shadows.card,
    marginBottom: Spacing.xl,
  },
  questionText: {
    ...Typography.h4,
    color: Colors.text,
    lineHeight: 26,
  },
  answersWrap: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  answerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  answerRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerRadioSelected: {
    borderColor: Colors.primary,
  },
  answerRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  answerText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  answerTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  navBtn: {
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.xpBarBg,
  },
  dotCurrent: {
    backgroundColor: Colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotAnswered: {
    backgroundColor: Colors.secondary,
  },
  // Result styles
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 40,
  },
  resultIconWrap: {
    marginBottom: Spacing.lg,
  },
  resultIcon: { fontSize: 72 },
  resultTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  scoreValue: {
    ...Typography.xp,
    color: Colors.textInverse,
  },
  scoreDetail: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  xpEarned: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.lg,
  },
  xpEarnedText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  resultMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  resultBtn: {
    width: '100%',
  },
});

export default QuizScreen;
