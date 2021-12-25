import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import styled from 'styled-components';

import {SessionList} from './session_list';
import {awaitStoresLoaded} from './stores';

const CLEAR_STORAGE_ON_STARTUP = false;

export const App: React.FC = () => {
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
    <SafeAreaWrapper>
      <StatusBar barStyle={'dark-content'} />
      {loading ? (
        <LoadingView>
          <LoadingText>Loading</LoadingText>
        </LoadingView>
      ) : (
        <SessionList />
      )}
    </SafeAreaWrapper>
  );
};
App.displayName = 'App';

const SafeAreaWrapper = styled(SafeAreaView)`
  background-color: #22223b;
`;

const LoadingView = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

const LoadingText = styled(Text)`
  color: #c9ada7;
  font-size: 32px;
`;
