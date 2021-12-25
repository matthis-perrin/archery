import React, {useCallback} from 'react';
import {Button, FlatList} from 'react-native';
import styled from 'styled-components';

import {LightText, Screen} from './fragments';
import {generateSessionId, Session} from './models';
import {SessionTile} from './session_tile';
import {SettingsButton} from './settings_button';
import {setSession, useAppState, useSessions} from './stores';

export const HomeScreen: React.FC = () => {
  const appState = useAppState();
  const sessions = useSessions();

  const handleAdd = useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: Session = {
      id: newSessionId,
      ends: [],
      ts: Date.now(),
    };
    setSession(newSessionId, newSession);
  }, []);

  const renderItem = useCallback(({item}: {item: Session}) => <SessionTile session={item} />, []);
  const keyExtractor = useCallback((item: Session) => item.id, []);

  return (
    <Wrapper>
      <Title>{`Page: ${appState.page}`}</Title>
      <Button title="Add" onPress={handleAdd} />
      <FlatList<Session>
        data={[...sessions.values()]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Wrapper>
  );
};
HomeScreen.displayName = 'HomeScreen';

const Wrapper = styled(Screen)``;

const Title = styled(LightText)`
  font-size: 32px;
  text-align: center;
`;
