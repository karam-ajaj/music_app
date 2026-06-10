import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { APP_NAME } from '../constants';
import { useT, useLang } from '../../App';

interface HomeScreenProps {
  onStart: () => void;
  loading: boolean;
}

export function HomeScreen({ onStart, loading }: HomeScreenProps) {
  const __ = useT();
  const { lang, setLang } = useLang();

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langToggle} onPress={toggleLang} activeOpacity={0.7}>
        <Text style={styles.langToggleText}>{__('langLabel')}</Text>
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🎵</Text>
        </View>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>
          {__('subtitle')}{'\n'}{__('subtitleDetail')}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.startButton, loading && styles.startButtonDisabled]}
        onPress={onStart}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.background} size="small" />
        ) : (
          <Text style={styles.startButtonText}>{__('startGame')}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>
        {__('poweredBy')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  langToggle: {
    position: 'absolute',
    top: theme.spacing.xxl,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  langToggleText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl * 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
