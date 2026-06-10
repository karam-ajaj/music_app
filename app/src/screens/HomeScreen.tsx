import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { APP_NAME, Decade } from '../constants';
import { useT, useLang } from '../../App';

interface HomeScreenProps {
  onStart: (decade: Decade) => void;
}

const DECADES: { key: Decade; labelEn: string; labelAr: string }[] = [
  { key: '70s', labelEn: '70s', labelAr: 'السبعينات' },
  { key: '80s', labelEn: '80s', labelAr: 'الثمانينات' },
  { key: '90s', labelEn: '90s', labelAr: 'التسعينات' },
  { key: 'all', labelEn: 'All Eras', labelAr: 'كل العصور' },
];

export function HomeScreen({ onStart }: HomeScreenProps) {
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
          {__('subtitleDetail')}
        </Text>
      </View>

      <Text style={styles.pickLabel}>{__('pickDecade')}</Text>

      <View style={styles.decadeGrid}>
        {DECADES.map((d) => (
          <TouchableOpacity
            key={d.key}
            style={[styles.decadeButton, d.key === 'all' && styles.decadeButtonAll]}
            onPress={() => onStart(d.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.decadeButtonText}>
              {lang === 'ar' ? d.labelAr : d.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
    marginBottom: theme.spacing.xl,
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
  pickLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  decadeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  decadeButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    minWidth: 120,
    alignItems: 'center',
  },
  decadeButtonAll: {
    minWidth: '80%',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  decadeButtonText: {
    color: theme.colors.text,
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
