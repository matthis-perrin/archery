import React from 'react';
import {Text, View, ViewProps} from 'react-native';
import styled from 'styled-components';

import {Score} from './models';
import {scoreColors, scoreText} from './score_circle';

interface EndCircleProps extends ViewProps {
  total: Score;
  avg: Score;
  precision?: number;
}

const WIDTH = 32;
const HEIGHT = 24;

export const EndCircle: React.FC<EndCircleProps> = React.memo(props => {
  const {total, avg, precision = 0, style, ...rest} = props;

  const text = scoreText(total, precision);
  const {backgroundColor, textColor} = scoreColors(avg);
  const borderRadius = HEIGHT / 2;

  return (
    <Wrapper
      style={[
        {
          backgroundColor,
          borderRadius,
          width: WIDTH * (1 + precision / 2),
          height: HEIGHT,
        },
        style,
      ]}
      {...rest}
    >
      <StyledText style={{color: textColor, fontSize: 16}}>{text}</StyledText>
    </Wrapper>
  );
});
EndCircle.displayName = 'EndCircle';

const Wrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled(Text)`
  font-weight: 600;
`;
