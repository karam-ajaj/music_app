import React, { useState, useCallback, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { theme } from './src/theme';
import { Language, t } from './src/i18n';
import { DecadeKey, RegionKey } from './src/constants';

type Screen = 'home' | 'game';

interface LangCtx {
  lang: Language;
  setLang: (l: Language) => void;
}

export const LangContext = createContext<LangCtx>({ lang: 'en', setLang: () => {} });
export const useLang = () => useContext(LangContext);
export const useT = () => {
  const { lang } = useLang();
  return (key: string) => t(lang, key);
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<Language>('ar');
  const [decades, setDecades] = useState<DecadeKey[]>([]);
  const [regions, setRegions] = useState<RegionKey[]>([]);
  const [players, setPlayers] = useState<string[]>(['']);
  const [scores, setScores] = useState<number[]>([0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const handleStart = useCallback((d: DecadeKey[], r: RegionKey[], p: string[]) => {
    setDecades(d);
    setRegions(r);
    setPlayers(p);
    setScores(p.map(() => 0));
    setCurrentPlayer(0);
    setScreen('game');
  }, []);

  const handleBack = useCallback(() => {
    setScreen('home');
  }, []);

  const handleCorrect = useCallback(() => {
    setScores((prev) => {
      const next = [...prev];
      next[currentPlayer] = (next[currentPlayer] || 0) + 1;
      return next;
    });
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  }, [currentPlayer, players.length]);

  const handleSkip = useCallback(() => {
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  }, [players.length]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        {screen === 'home' && (
          <HomeScreen onStart={handleStart} />
        )}
        {screen === 'game' && (
          <GameScreen
            decades={decades}
            regions={regions}
            players={players}
            scores={scores}
            currentPlayer={currentPlayer}
            onBack={handleBack}
            onCorrect={handleCorrect}
            onSkip={handleSkip}
          />
        )}
      </View>
    </LangContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
