import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components';

import {RouteParams} from './app';
import {LightText, Screen} from './fragments';

export const SessionScreen: React.FC = React.memo(() => {
  const {
    params: {session},
  } = useRoute<RouteProp<RouteParams, 'Session'>>();

  return (
    <Wrapper>
      <Title>{session.id}</Title>
    </Wrapper>
  );
});
SessionScreen.displayName = 'SessionScreen';

const Wrapper = styled(Screen)``;

const Title = styled(LightText)`
  font-size: 32px;
  text-align: center;
`;
