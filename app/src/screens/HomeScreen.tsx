import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { APP_NAME, Decade, Region, REGIONS } from '../constants';
import { useT, useLang } from '../../App';

interface HomeScreenProps {
  onStart: (decade: Decade, region: Region) => void;
}

const DECADES: { key: Decade; labelEn: string; labelAr: string }[] = [
  { key: '70s', labelEn: '70s', labelAr: 'السبعينات' },
  { key: '80s', labelEn: '80s', labelAr: 'الثمانينات' },
  { key: '90s', labelEn: '90s', labelAr: 'التسعينات' },
  { key: 'all', labelEn: 'All', labelAr: 'الكل' },
];

export function HomeScreen({ onStart }: HomeScreenProps) {
  const __ = useT();
  const { lang, setLang } = useLang();
  const [decade, setDecade] = React.useState<Decade>('all');
  const [region, setRegion] = React.useState<Region>('all');

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
      </View>

      <Text style={styles.pickLabel}>{__('pickDecade')}</Text>
      <View style={styles.chipRow}>
        {DECADES.map((d) => (
          <TouchableOpacity
            key={d.key}
            style={[styles.chip, decade === d.key && styles.chipActive]}
            onPress={() => setDecade(d.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, decade === d.key && styles.chipTextActive]}>
              {lang === 'ar' ? d.labelAr : d.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.pickLabel}>{__('pickRegion')}</Text>
      <View style={styles.chipRow}>
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.chip, region === r.key && styles.chipActive]}
            onPress={() => setRegion(r.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, region === r.key && styles.chipTextActive]}>
              {lang === 'ar' ? r.labelAr : r.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, region === 'all' && styles.chipActive]}
          onPress={() => setRegion('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, region === 'all' && styles.chipTextActive]}>
            {__('allRegions')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => onStart(decade, region)}
        activeOpacity={0.7}
      >
        <Text style={styles.startButtonText}>{__('startGame')}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>{__('poweredBy')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
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
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  logo: { fontSize: 40 },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  pickLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  chipTextActive: {
    color: theme.colors.background,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 200,
    alignItems: 'center',
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
    fontSize: theme.fontSize.xs,
  },
});
