import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSmall = size === 'sm';

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[{ borderRadius: BorderRadius.button }, style]}
      >
        <LinearGradient
          colors={disabled ? ['#B2BEC3', '#B2BEC3'] : [Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, isSmall && styles.buttonSm]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} size="small" />
          ) : (
            <>
              {icon && <Text style={styles.iconLeft}>{icon}</Text>}
              <Text style={[styles.text, isSmall && styles.textSm]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        isSmall && styles.buttonSm,
        isSecondary && styles.buttonSecondary,
        isOutline && styles.buttonOutline,
        isDanger && styles.buttonDanger,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? Colors.primary : isDanger ? Colors.textInverse : Colors.textInverse}
          size="small"
        />
      ) : (
        <>
          {icon && <Text style={styles.iconLeft}>{icon}</Text>}
          <Text
            style={[
              styles.text,
              isSmall && styles.textSm,
              isSecondary && styles.textSecondary,
              isOutline && styles.textOutline,
              isDanger && styles.textDanger,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonSm: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonDanger: {
    backgroundColor: Colors.danger,
  },
  buttonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textSm: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textSecondary: {
    color: Colors.textInverse,
  },
  textOutline: {
    color: Colors.primary,
  },
  textDanger: {
    color: Colors.textInverse,
  },
  iconLeft: {
    fontSize: 18,
  },
});

export default Button;
