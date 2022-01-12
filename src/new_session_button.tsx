import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

import {TextButton} from './button';
import {useNewSessionCallback} from './use_new_session_callback';

export const NewSessionButton: React.FC = () => {
  const handleNew = useNewSessionCallback();

  return (
    <Wrapper>
      <TextButton title="Nouvelle feuille de score" onPress={handleNew} />
    </Wrapper>
  );
};
NewSessionButton.displayName = 'NewSessionButton';

const Wrapper = styled(View)`
  margin: 0 0 16px 0;
`;
