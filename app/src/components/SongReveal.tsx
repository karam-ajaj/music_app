import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Track } from '../types';
import { theme } from '../theme';

interface SongRevealProps {
  track: Track;
}

const ART_SIZE = Dimensions.get('window').width * 0.5;

export function SongReveal({ track }: SongRevealProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: track.albumArt }}
          style={styles.albumArt}
        />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {track.name}
          </Text>

          <Text style={styles.artist} numberOfLines={1}>
            {track.artists.join(', ')}
          </Text>

          <View style={styles.details}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{track.album}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{track.year}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  albumArt: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  info: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  artist: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  details: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
});
