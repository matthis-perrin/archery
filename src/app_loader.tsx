import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {StatusBar, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components';

import {App} from './app';
import {LoadingScreen} from './loading_screen';
import {awaitStoresLoaded} from './stores';

const CLEAR_STORAGE_ON_STARTUP = false;

export const AppLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
      <StatusBar barStyle={'dark-content'} />
      {loading ? <LoadingScreen /> : <App />}
    </SafeAreaProvider>
  );
};
AppLoader.displayName = 'AppLoader';
