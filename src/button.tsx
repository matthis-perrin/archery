import React, {FC, useCallback, useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

interface TextButtonProps {
  title: string;
  opacity?: number;
  onPress: () => Promise<void>;
}

const DEFAULT_OPACITY = 0.5;

export const TextButton: FC<TextButtonProps> = props => {
  const [loading, setLoading] = useState(false);
  const {title, opacity = DEFAULT_OPACITY, onPress} = props;

  const handlePress = useCallback(() => {
    setLoading(true);
    onPress()
      .catch(console.error)
      .finally(() => setLoading(false));
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
  background-color: #f9c784;
`;
const StyledText = styled(Text)`
  font-size: 16px;
`;
