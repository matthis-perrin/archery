import React, {useCallback, useRef} from 'react';
import {Button, Text, View} from 'react-native';
import styled from 'styled-components';

import {Session} from './models';
import {deleteSession, setSession} from './stores';

interface SessionTileProps {
  session: Session;
}

export const SessionTile: React.FC<SessionTileProps> = React.memo(({session}) => {
  const renderCount = useRef(0);
  renderCount.current++;

  const handleUpdate = useCallback(() => {
    setSession(session.id, {...session, ts: Date.now()});
  }, [session]);

  const handleDelete = useCallback(() => {
    deleteSession(session.id);
  }, [session.id]);

  return (
    <Wrapper>
      <LightText>{session.id}</LightText>
      <LightText>{session.ts}</LightText>
      <LightText>{renderCount.current}</LightText>
      <Button title="Update" onPress={handleUpdate} />
      <Button title="Delete" onPress={handleDelete} />
    </Wrapper>
  );
});
SessionTile.displayName = 'SessionTile';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const LightText = styled(Text)`
  color: #c9ada7;
  font-size: 16px;
`;
