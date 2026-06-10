import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Track } from '../types';

const BUFFER_SECONDS = 30;

export function useAudioPlayer() {
  const player = useExpoAudioPlayer(null, {
    preferredForwardBufferDuration: BUFFER_SECONDS,
  });
  const status = useAudioPlayerStatus(player);

  const playTrack = (track: Track) => {
    if (!track.previewUrl) return;
    player.replace(track.previewUrl);
  };

  const stopPlayback = () => {
    player.pause();
  };

  return {
    player,
    status,
    playTrack,
    stopPlayback,
  };
}
