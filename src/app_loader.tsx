import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {Fragment, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';

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
    <Fragment>
      <StatusBar barStyle={'light-content'} />
      {loading ? <LoadingScreen /> : <App />}
    </Fragment>
  );
};
AppLoader.displayName = 'AppLoader';
