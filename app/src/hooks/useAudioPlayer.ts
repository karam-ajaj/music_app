import { useEffect, useRef, useState, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Track } from '../types';

interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  isLoaded: boolean;
}

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [player, setPlayer] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<PlayerState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    isLoaded: false,
  });

  const onStatusUpdate = useCallback((s: AVPlaybackStatus) => {
    if (s.isLoaded) {
      setStatus({
        playing: s.isPlaying,
        currentTime: s.positionMillis / 1000,
        duration: (s.durationMillis || 1) / 1000,
        isLoaded: true,
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    if (!track.previewUrl) return;
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.previewUrl },
        { shouldPlay: true },
        onStatusUpdate
      );
      soundRef.current = sound;
      setPlayer(sound);
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }, [onStatusUpdate]);

  return {
    player,
    status,
    playTrack,
  };
}
