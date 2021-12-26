import React, {useCallback} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

import {TextButton} from './button';
import {LightText} from './fragments';
import {generateSessionId, Session} from './models';
import {setSession} from './stores';

export const NoSession: React.FC = () => {
  const handleNew = useCallback(() => {
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
      <Title>Vous n'avez pas encore de feuilles de score enregistrées</Title>
      <TextButton title="Nouvelle feuille de score" onPress={handleNew} />
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
