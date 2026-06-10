import React, { useState, useCallback, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { theme } from './src/theme';
import { Language, t } from './src/i18n';
import { Decade, Region } from './src/constants';

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
  const [lang, setLang] = useState<Language>('en');
  const [decade, setDecade] = useState<Decade>('all');
  const [region, setRegion] = useState<Region>('all');

  const handleStart = useCallback((d: Decade, r: Region) => {
    setDecade(d);
    setRegion(r);
    setScreen('game');
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        {screen === 'home' && (
          <HomeScreen onStart={handleStart} />
        )}
        {screen === 'game' && (
          <GameScreen decade={decade} region={region} />
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
