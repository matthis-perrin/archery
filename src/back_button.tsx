import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components';

import {useNav} from './navigation';

export const BackButton = (text: string): JSX.Element => {
  const {goBack} = useNav();
  return (
    // eslint-disable-next-line react/jsx-handler-names
    <TouchableOpacity onPress={goBack}>
      <StyledText>{text}</StyledText>
    </TouchableOpacity>
  );
};
BackButton.displayName = 'BackButton';

const StyledText = styled(Text)`
  font-size: 16px;
`;
