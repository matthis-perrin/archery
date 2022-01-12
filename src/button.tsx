import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

import {MY_YELLOW} from './colors';
import {error} from './logger';

interface TextButtonProps {
  title: string;
  opacity?: number;
  onPress: () => Promise<void> | void;
}

const DEFAULT_OPACITY = 0.5;

export const TextButton: FC<TextButtonProps> = props => {
  const [loading, setLoading] = useState(false);
  const {title, opacity = DEFAULT_OPACITY, onPress} = props;

  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const handlePress = useCallback(() => {
    setLoading(true);
    Promise.resolve(onPress())
      .catch(error)
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, [onPress]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Content style={{opacity: loading ? opacity : 1}}>
        <StyledText>{title}</StyledText>
      </Content>
    </TouchableWithoutFeedback>
  );
};
TextButton.displayName = 'TextButton';

const Content = styled(View)`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${MY_YELLOW};
`;
const StyledText = styled(Text)`
  font-size: 16px;
`;
