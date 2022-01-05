import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

import {LightText} from './fragments';
import {NewSessionButton} from './new_session_button';

export const NoSession: React.FC = () => {
  return (
    <Wrapper>
      <Title>Vous n'avez pas encore de feuilles de score enregistrées</Title>
      <NewSessionButton />
    </Wrapper>
  );
};
NoSession.displayName = 'NoSession';

const Wrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 32px;
  height: 50%;
`;

const Title = styled(LightText)`
  font-size: 24px;
  text-align: center;
  margin-bottom: 32px;
`;
