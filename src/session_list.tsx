import React, {useCallback} from 'react';
import {Button, Text, View} from 'react-native';
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

  return (
    <Wrapper>
      <Title>{`Page: ${appState.page}`}</Title>
      <Button title="Add" onPress={handleAdd} />
      <List>
        {[...sessions.values()].map(session => (
          <SessionTile key={session.id} session={session} />
        ))}
      </List>
    </Wrapper>
  );
};
SessionList.displayName = 'SessionList';

const Wrapper = styled(View)``;

const Title = styled(Text)`
  color: #c9ada7;
  font-size: 32px;
`;

const List = styled(View)`
  display: flex;
`;
