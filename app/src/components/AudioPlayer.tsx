import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useT } from '../../App';

interface AudioPlayerProps {
  playing: boolean;
  currentTime: number;
  duration: number;
  finished: boolean;
  onPlayPause: () => void;
  onReplay: () => void;
}

function formatTime(seconds: number): string {
  const s = Math.floor(seconds);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ playing, currentTime, duration, finished, onPlayPause, onReplay }: AudioPlayerProps) {
  const __ = useT();
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {finished ? (
        <TouchableOpacity
          style={styles.replayButton}
          onPress={onReplay}
          activeOpacity={0.7}
        >
          <Text style={styles.replayIcon}>↻</Text>
          <Text style={styles.replayLabel}>{__('replay')}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.playButton, playing && styles.playButtonActive]}
            onPress={onPlayPause}
            activeOpacity={0.7}
          >
            <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {playing ? __('playingPreview') : __('paused')}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  timeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  playButtonActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  playIcon: {
    fontSize: 32,
    color: theme.colors.background,
  },
  statusText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  replayIcon: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  replayLabel: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
});
