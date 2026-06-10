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
import { useT } from '../../App';
import { Decade, Region } from '../constants';

interface GameScreenProps {
  decade: Decade;
  region: Region;
}

export function GameScreen({ decade, region }: GameScreenProps) {
  const __ = useT();
  const { player, status, playTrack } = useAudioPlayer();
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
  } = useGameData(decade, region);

  const totalSongs = playedIds.length + queue.length + (currentTrack ? 1 : 0);
  const playedCount = playedIds.length + 1;
  const hasAudio = !!currentTrack?.previewUrl;

  React.useEffect(() => {
    if (currentTrack && phase === 'playing') {
      playTrack(currentTrack);
    }
  }, [currentTrack?.id]);

  const handleReveal = () => {
    reveal();
  };

  const handleNextSong = () => {
    nextSong();
  };

  if (!currentTrack && !loading && !error) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.7}>
          <Text style={styles.startButtonText}>{__('restart')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{__('loadingSongs')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={startGame} activeOpacity={0.7}>
          <Text style={styles.retryButtonText}>{__('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{__('noSongs')}</Text>
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
              <Text style={styles.guessLabel}>{__('whatSong')}</Text>
              <View style={styles.mysteryDisc}>
                <Text style={styles.mysteryIcon}>🎶</Text>
              </View>
            </View>

            {hasAudio ? (
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
            ) : (
              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeText}>
                  {__('loadingPreview')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.revealButton}
              onPress={handleReveal}
              activeOpacity={0.7}
            >
              <Text style={styles.revealButtonText}>{__('revealAnswer')}</Text>
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
              <Text style={styles.nextButtonText}>{__('nextSong')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: theme.spacing.xxl,
    right: theme.spacing.lg,
  },
  counter: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    alignItems: 'center',
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
  demoNotice: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  demoNoticeText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  revealButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
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
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    width: '100%',
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
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.full,
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
});
