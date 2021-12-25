import React from 'react';
import styled from 'styled-components';

import {LightText, Screen} from './fragments';

export const SettingsScreen: React.FC = () => {
  return (
    <Wrapper>
      <LightText>Settings here</LightText>
    </Wrapper>
  );
};
SettingsScreen.displayName = 'SettingsScreen';

const Wrapper = styled(Screen)``;
