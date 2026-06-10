import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Track } from '../types';

export function useAudioPlayer() {
  const player = useExpoAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const playTrack = (track: Track) => {
    if (!track.previewUrl) return;
    player.replace(track.previewUrl);
    player.play();
  };

  const stopPlayback = () => {
    player.pause();
  };

  const replayFromStart = () => {
    player.seekTo(0);
    player.play();
  };

  return {
    player,
    status,
    playTrack,
    stopPlayback,
    replayFromStart,
  };
}
