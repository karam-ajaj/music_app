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
  onBack: () => void;
  onScore: (playerIdx: number) => void;
  onNoScore: () => void;
}

export function GameScreen({ decades, regions, players, scores, onBack, onScore, onNoScore }: GameScreenProps) {
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
  const [showHelp, setShowHelp] = React.useState(false);

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

        <TouchableOpacity onPress={() => setShowHelp(!showHelp)} style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>?</Text>
        </TouchableOpacity>

        {players.length > 1 && (
          <View style={styles.scoreRow}>
            {players.map((p, i) => (
              <View key={i} style={styles.scoreBadge}>
                <Text style={styles.scoreName}>{p}</Text>
                <Text style={styles.scorePts}>{scores[i] || 0}</Text>
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
              <Text style={styles.guessLabel}>{__('listenGuess')}</Text>
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

            {players.length > 1 ? (
              <View style={styles.scoreBoard}>
                <Text style={styles.scoreWho}>{__('whoGotIt')}</Text>
                {players.map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.playerScoreBtn}
                    onPress={() => { onScore(i); nextSong(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.playerScoreBtnText}>✓ {p}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.noOneBtn}
                  onPress={() => { onNoScore(); nextSong(); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.noOneBtnText}>{__('noOneKnew')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.soloNextBtn}
                onPress={handleNextSong}
                activeOpacity={0.7}
              >
                <Text style={styles.soloNextBtnText}>{__('nextSong')}</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {showHelp && (
          <View style={styles.helpOverlay}>
            <View style={styles.helpCard}>
              <Text style={styles.helpTitle}>{__('howToPlay')}</Text>
              <Text style={styles.helpText}>{__('helpText')}</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)} style={styles.helpCloseBtn}>
                <Text style={styles.helpCloseText}>{__('gotIt')}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  scoreName: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
  },
  scorePts: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
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
  scoreBoard: {
    marginTop: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  scoreWho: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  playerScoreBtn: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  playerScoreBtnText: {
    color: '#fff',
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  noOneBtn: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    width: '100%',
  },
  noOneBtnText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
  },
  soloNextBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.xl,
  },
  soloNextBtnText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  helpBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  helpBtnText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  helpOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  helpCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxHeight: '80%',
  },
  helpTitle: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  helpText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  helpCloseBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  helpCloseText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
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
