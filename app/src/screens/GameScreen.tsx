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
import { DecadeKey, RegionKey } from '../constants';

interface GameScreenProps {
  decades: DecadeKey[];
  regions: RegionKey[];
  players: string[];
  scores: number[];
  currentPlayer: number;
  onBack: () => void;
  onCorrect: () => void;
  onSkip: () => void;
}

export function GameScreen({ decades, regions, players, scores, currentPlayer, onBack, onCorrect, onSkip }: GameScreenProps) {
  const __ = useT();
  const { player, status, playTrack } = useAudioPlayer();
  const {
    phase,
    currentTrack,
    playedIds,
    queue,
    loading,
    error,
    trackCount,
    artistCount,
    startGame,
    reveal,
    nextSong,
  } = useGameData(decades, regions);

  const totalSongs = playedIds.length + queue.length + (currentTrack ? 1 : 0);
  const playedCount = playedIds.length + 1;
  const hasAudio = !!currentTrack?.previewUrl;

  const finished =
    hasAudio &&
    !status.playing &&
    status.duration > 0 &&
    status.currentTime > 0.5 &&
    status.currentTime >= status.duration - 1;

  React.useEffect(() => {
    if (currentTrack && phase === 'playing') {
      playTrack(currentTrack);
    }
  }, [currentTrack?.id]);

  const handleReplay = () => {
    player.seekTo(0);
    player.play();
  };

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
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backBtnText}>⌂</Text>
        </TouchableOpacity>

        {players.length > 1 && (
          <View style={styles.scoreRow}>
            {players.map((p, i) => (
              <View
                key={i}
                style={[styles.scoreBadge, i === currentPlayer && styles.scoreBadgeActive]}
              >
                <Text style={[styles.scoreName, i === currentPlayer && styles.scoreNameActive]}>
                  {p}
                </Text>
                <Text style={[styles.scorePts, i === currentPlayer && styles.scorePtsActive]}>
                  {scores[i] || 0}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.statsCol}>
          <Text style={styles.counter}>{playedCount}/{totalSongs}</Text>
          {trackCount > 0 && (
            <Text style={styles.statsDetail}>
              {trackCount} songs · {artistCount} artists
            </Text>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {phase === 'playing' && (
          <>
            <View style={styles.guessArea}>
              <Text style={styles.guessLabel}>
                {players.length > 1
                  ? `${players[currentPlayer]}، ${__('yourTurn')}`
                  : __('listenGuess')}
              </Text>
              <Text style={styles.guessSubLabel}>{__('guessArtist')}</Text>
              <View style={styles.mysteryDisc}>
                <Text style={styles.mysteryIcon}>🎶</Text>
              </View>
            </View>

            {hasAudio ? (
              <AudioPlayer
                playing={status.playing}
                currentTime={status.currentTime}
                duration={status.duration}
                finished={finished}
                onPlayPause={() => {
                  if (status.playing) {
                    player.pause();
                  } else {
                    player.play();
                  }
                }}
                onReplay={handleReplay}
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

            <View style={styles.resultRow}>
              <TouchableOpacity
                style={styles.correctBtn}
                onPress={() => { onCorrect(); nextSong(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.correctBtnText}>✓ {__('correct')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => { onSkip(); nextSong(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.skipBtnText}>→ {__('skip')}</Text>
              </TouchableOpacity>
            </View>
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
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backBtn: {
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  backBtnText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.xl,
  },
  counter: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    textAlign: 'right',
  },
  statsCol: {
    alignItems: 'flex-end',
  },
  statsDetail: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  scoreBadge: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    minWidth: 50,
  },
  scoreBadgeActive: {
    backgroundColor: theme.colors.primary,
  },
  scoreName: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
  },
  scoreNameActive: {
    color: theme.colors.background,
    fontWeight: '700',
  },
  scorePts: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  scorePtsActive: {
    color: theme.colors.background,
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
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  guessSubLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
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
  resultRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  correctBtn: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    flex: 1,
  },
  correctBtnText: {
    color: '#fff',
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  skipBtn: {
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
  },
  skipBtnText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
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
