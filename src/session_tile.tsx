import React, {useCallback} from 'react';
import {TouchableHighlight, View} from 'react-native';
import styled from 'styled-components';

import {LightText} from './fragments';
import {Session} from './models';
import {useNav} from './navigation';
import {endCount, sessionScore} from './session';

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

  const count = endCount(session);
  const total = sessionScore(session);

  const handlePress = useCallback(() => {
    navigate('Session', {sessionId: session.id});
  }, [navigate, session]);

  return (
    <TouchableHighlight onPress={handlePress}>
      <Wrapper>
        <Left>
          <LightText>{[...new Array(session.endSize)].map(() => '➴').join('')}</LightText>
          <LightText>{`${count} volées`}</LightText>
        </Left>
        <Right>
          <Total>{total?.value ?? 0}</Total>
        </Right>
      </Wrapper>
    </TouchableHighlight>
  );
});
SessionTile.displayName = 'SessionTile';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
  padding: 0 32px;
  background-color: #ffffff33;
`;

const Left = styled(View)`
  flex-grow: 1;
`;
const Right = styled(View)`
  flex-shrink: 0;
`;

const Total = styled(LightText)`
  font-size: 32px;
`;
