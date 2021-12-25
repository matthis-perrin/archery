import React from 'react';
import styled from 'styled-components';

import {LightText, Screen} from './fragments';

export const LoadingScreen: React.FC = () => {
  return (
    <LoadingView>
      <LoadingText>Loading</LoadingText>
    </LoadingView>
  );
};
LoadingScreen.displayName = 'LoadingScreen...';

const LoadingView = styled(Screen)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled(LightText)`
  font-size: 32px;
`;
