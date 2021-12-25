import React, {useCallback} from 'react';
import {Button, FlatList, Text, View} from 'react-native';
import styled from 'styled-components';

import {generateSessionId, Session} from './models';
import {SessionTile} from './session_tile';
import {setSession, useAppState, useSessions} from './stores';

export const SessionList: React.FC = () => {
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
SessionList.displayName = 'SessionList';

const Wrapper = styled(View)`
  height: 100%;
`;

const Title = styled(Text)`
  color: #c9ada7;
  font-size: 32px;
  text-align: center;
`;
