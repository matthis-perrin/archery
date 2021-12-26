import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, {useCallback} from 'react';
import {DevSettings} from 'react-native';
import styled from 'styled-components';

import {TextButton} from './button';
import {Screen} from './fragments';
import {sleep} from './sleep';

export const SettingsScreen: React.FC = () => {
  const handleClearData = useCallback(async () => {
    await sleep(1000);
    await AsyncStorageLib.clear();
    DevSettings.reload();
  }, []);

  return (
    <Wrapper>
      <TextButton title="Clear all data and reload" onPress={handleClearData}></TextButton>
    </Wrapper>
  );
};
SettingsScreen.displayName = 'SettingsScreen';

const Wrapper = styled(Screen)`
  padding: 32px 32px 0 32px;
`;
