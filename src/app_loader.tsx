import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {App} from './app';
import {MY_RED} from './colors';
import {LoadingScreen} from './loading_screen';
import {awaitStoresLoaded} from './stores';

const CLEAR_STORAGE_ON_STARTUP = false;

export const AppLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    changeNavigationBarColor(MY_RED, true, false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const clearPromise = CLEAR_STORAGE_ON_STARTUP ? AsyncStorageLib.clear() : Promise.resolve();
    clearPromise
      .then(awaitStoresLoaded)
      .then(() => {
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={MY_RED} />
      {loading ? <LoadingScreen /> : <App />}
    </SafeAreaProvider>
  );
};
AppLoader.displayName = 'AppLoader';
