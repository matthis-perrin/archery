import React, {useCallback, useRef} from 'react';
import {TouchableHighlight, View} from 'react-native';
import styled from 'styled-components';

import {LightText} from './fragments';
import {Session} from './models';
import {useNav} from './navigation';

interface SessionTileProps {
  session: Session;
}

export const SessionTile: React.FC<SessionTileProps> = React.memo(({session}) => {
  const {navigate} = useNav();

  // const handleUpdate = useCallback(() => {
  //   setSession(session.id, {...session, ts: Date.now()});
  // }, [session]);

  // const handleDelete = useCallback(() => {
  //   deleteSession(session.id);
  // }, [session.id]);

  const handlePress = useCallback(() => {
    navigate('Session', {sessionId: session.id});
  }, [navigate, session]);

  return (
    <TouchableHighlight onPress={handlePress}>
      <Wrapper>
        <StyledText>{new Date(session.ts).toLocaleString()}</StyledText>
      </Wrapper>
    </TouchableHighlight>
  );
});
SessionTile.displayName = 'SessionTile';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  height: 100px;
  background-color: #ffffff33;
`;

const StyledText = styled(LightText)`
  font-size: 16px;
`;
