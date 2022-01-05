import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {padNumber} from './format';
import {Session} from './models';

export const SCORE_FORM_HEIGHT = 300;

interface SessionHeaderProps {
  session: Session;
}

export const SessionHeader: React.FC<SessionHeaderProps> = React.memo(props => {
  const {session} = props;

  const start = new Date(session.ts);
  const day = start.toLocaleDateString();
  const time = `${padNumber(start.getHours(), 2)}h${padNumber(start.getMinutes(), 2)}`;

  return (
    <Header>
      <HeaderLeft>
        <Text>{`${session.distance}m`}</Text>
        <Text>{session.diameter}</Text>
        <Text>{[...new Array(session.endSize)].map(() => `➴`).join('')}</Text>
      </HeaderLeft>
      <HeaderRight>
        <Text>{`${day} - ${time}`}</Text>
      </HeaderRight>
    </Header>
  );
});
SessionHeader.displayName = 'SessionHeader';

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff77;
  padding: 8px;
`;

const HeaderLeft = styled(View)`
  display: flex;
  flex-direction: row;
`;
const HeaderRight = styled(View)``;
