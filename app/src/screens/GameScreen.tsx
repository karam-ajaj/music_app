import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AudioPlayer } from '../components/AudioPlayer';
import { SongReveal } from '../components/SongReveal';
import { theme } from '../theme';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useGameData } from '../hooks/useGameData';

export function GameScreen() {
  const { player, status, playTrack, stopPlayback } = useAudioPlayer();
  const {
    phase,
    currentTrack,
    playedIds,
    queue,
    loading,
    error,
    startGame,
    reveal,
    nextSong,
  } = useGameData();

  const totalSongs = playedIds.length + queue.length + (currentTrack ? 1 : 0);
  const playedCount = playedIds.length + 1;

  React.useEffect(() => {
    if (currentTrack && phase === 'playing') {
      playTrack(currentTrack);
    }
  }, [currentTrack?.id]);

  const handleReveal = () => {
    stopPlayback();
    reveal();
  };

  const handleNextSong = () => {
    nextSong();
  };

  if (!currentTrack && !loading && !error) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Press start to begin the game!</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading songs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={startGame} activeOpacity={0.7}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No songs available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counter}>
          {playedCount} / {totalSongs}
        </Text>
      </View>

      <View style={styles.content}>
        {phase === 'playing' && (
          <>
            <View style={styles.guessArea}>
              <Text style={styles.guessLabel}>What song is this?</Text>
              <View style={styles.mysteryDisc}>
                <Text style={styles.mysteryIcon}>🎶</Text>
              </View>
            </View>

            <AudioPlayer
              playing={status.playing}
              currentTime={status.currentTime}
              duration={status.duration}
              onPlayPause={() => {
                if (status.playing) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            />

            <TouchableOpacity
              style={styles.revealButton}
              onPress={handleReveal}
              activeOpacity={0.7}
            >
              <Text style={styles.revealButtonText}>Reveal Answer</Text>
            </TouchableOpacity>
          </>
        )}

        {phase === 'revealed' && (
          <>
            <SongReveal track={currentTrack} />

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextSong}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>Next Song</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  counter: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  guessArea: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  guessLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.xl,
  },
  mysteryDisc: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  mysteryIcon: {
    fontSize: 48,
  },
  revealButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  revealButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});
