import {Text, View} from 'react-native';
import styled from 'styled-components';

import {MY_PURPLE, MY_YELLOW} from './colors';

export const Screen = styled(View)`
  height: 100%;
  background-color: ${MY_PURPLE};
`;

export const LightText = styled(Text)`
  color: ${MY_YELLOW};
`;
