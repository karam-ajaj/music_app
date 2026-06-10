import { useState, useCallback } from 'react';
import { Track, GamePhase } from '../types';
import { fetchTracks } from '../services/tracks';
import { Decade, Region } from '../constants';

export function useGameData(decade: Decade, region: Region) {
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playedIds, setPlayedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tracks = await fetchTracks(decade, region);
      if (tracks.length === 0) {
        setError('No songs found for this selection.');
        return;
      }
      setQueue(tracks);
      setPlayedIds([]);
      setPhase('playing');

      const track = tracks[tracks.length - 1];
      setCurrentTrack(track);
      setQueue((prev) => prev.slice(0, -1));
    } catch {
      setError('Failed to load tracks. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [decade, region]);

  const pickNext = useCallback(() => {
    if (queue.length === 0) {
      setError('No more songs! Restart the game.');
      return;
    }
    const idx = Math.floor(Math.random() * queue.length);
    const track = queue[idx];
    setCurrentTrack(track);
    setQueue((prev) => prev.filter((_, i) => i !== idx));
  }, [queue]);

  const reveal = useCallback(() => {
    setPhase('revealed');
  }, []);

  const nextSong = useCallback(() => {
    if (currentTrack) {
      setPlayedIds((prev) => [...prev, currentTrack.id]);
    }
    setPhase('playing');
    pickNext();
  }, [currentTrack, pickNext]);

  return {
    phase,
    currentTrack,
    queue,
    playedIds,
    loading,
    error,
    startGame,
    reveal,
    nextSong,
  };
}
