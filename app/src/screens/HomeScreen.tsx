import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { APP_VERSION, DecadeKey, RegionKey, ALL_DECADES, ALL_REGIONS, DECADE_LABELS, REGIONS } from '../constants';
import { useT, useLang } from '../../App';

interface HomeScreenProps {
  onStart: (decades: DecadeKey[], regions: RegionKey[], players: string[]) => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const __ = useT();
  const { lang, setLang } = useLang();
  const [decades, setDecades] = React.useState<DecadeKey[]>([]);
  const [regions, setRegions] = React.useState<RegionKey[]>([]);
  const [players, setPlayers] = React.useState<string[]>(['']);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  const updatePlayer = (idx: number, name: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[idx] = name;
      return next;
    });
  };

  const addPlayer = () => {
    if (players.length < 4) setPlayers((prev) => [...prev, '']);
  };

  const removePlayer = (idx: number) => {
    if (players.length > 1) setPlayers((prev) => prev.filter((_, i) => i !== idx));
  };

  const canStart = decades.length > 0 && regions.length > 0 && players.some((p) => p.trim());

  const handleStartClick = () => {
    const names = players.map((p, i) => p.trim() || __('player') + ' ' + (i + 1));
    onStart(decades, regions, names);
  };

  const toggleDecade = (d: DecadeKey) => {
    setDecades((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleAllDecades = () => {
    setDecades(decades.length === ALL_DECADES.length ? [] : [...ALL_DECADES]);
  };

  const toggleRegion = (r: RegionKey) => {
    setRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const toggleAllRegions = () => {
    setRegions(regions.length === ALL_REGIONS.length ? [] : [...ALL_REGIONS]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.langToggle} onPress={toggleLang} activeOpacity={0.7}>
        <Text style={styles.langToggleText}>{__('langLabel')}</Text>
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>اسمع</Text>
        </View>
        <Text style={styles.subtitle}>
          {__('subtitle')}
        </Text>
      </View>

      <Text style={styles.pickLabel}>{__('pickDecade')}</Text>
      <View style={styles.chipRow}>
        {DECADE_LABELS.map((d) => (
          <TouchableOpacity
            key={d.key}
            style={[styles.chip, decades.includes(d.key) && decades.length !== ALL_DECADES.length && styles.chipActive]}
            onPress={() => toggleDecade(d.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, decades.includes(d.key) && decades.length !== ALL_DECADES.length && styles.chipTextActive]}>
              {lang === 'ar' ? d.labelAr : d.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, decades.length === ALL_DECADES.length && styles.chipActive]}
          onPress={toggleAllDecades}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, decades.length === ALL_DECADES.length && styles.chipTextActive]}>
            {__('all')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pickLabel}>{__('pickRegion')}</Text>
      <View style={styles.chipRow}>
        {REGIONS.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.chip, regions.includes(r.key) && regions.length !== ALL_REGIONS.length && styles.chipActive]}
            onPress={() => toggleRegion(r.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, regions.includes(r.key) && regions.length !== ALL_REGIONS.length && styles.chipTextActive]}>
              {lang === 'ar' ? r.labelAr : r.labelEn}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, regions.length === ALL_REGIONS.length && styles.chipActive]}
          onPress={toggleAllRegions}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, regions.length === ALL_REGIONS.length && styles.chipTextActive]}>
            {__('all')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pickLabel}>{__('players')}</Text>
      {players.map((p, i) => (
        <View key={i} style={styles.playerRow}>
          <TextInput
            style={styles.playerInput}
            value={p}
            onChangeText={(t) => updatePlayer(i, t)}
            placeholder={__('playerName') + ' ' + (i + 1)}
            placeholderTextColor={theme.colors.textMuted}
            maxLength={12}
          />
          {players.length > 1 && (
            <TouchableOpacity onPress={() => removePlayer(i)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {players.length < 4 && (
        <TouchableOpacity onPress={addPlayer} style={styles.addPlayerBtn}>
          <Text style={styles.addPlayerText}>+ {__('addPlayer')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.startButton, !canStart && styles.startButtonDisabled]}
        onPress={handleStartClick}
        disabled={!canStart}
        activeOpacity={0.7}
      >
        <Text style={styles.startButtonText}>{__('startGame')}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>v{APP_VERSION}</Text>
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
    width: 120,
    height: 120,
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
  logo: { fontSize: 48, color: theme.colors.primary, fontWeight: '800' },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
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
  startButtonDisabled: {
    opacity: 0.4,
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
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  playerInput: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    minWidth: 180,
    textAlign: 'center',
  },
  removeBtn: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.danger,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  addPlayerBtn: {
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  addPlayerText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
});
