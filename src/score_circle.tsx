import React from 'react';
import {Text, View, ViewProps} from 'react-native';
import styled from 'styled-components';

import {SCORE_BLACK, SCORE_BLUE, SCORE_GRAY, SCORE_RED, SCORE_WHITE, SCORE_YELLOW} from './colors';
import {Score} from './models';
import {NO_SCORE} from './session';

type ScoreSize = 'small' | 'medium';

interface ScoreCircleProps extends ViewProps {
  score?: Score;
  square?: boolean;
  border?: boolean;
  size?: ScoreSize;
}

function scoreText(score: Score): string {
  if (score === NO_SCORE) {
    return '';
  }
  return String(score.value);
}

/* eslint-disable @typescript-eslint/no-magic-numbers */
function scoreColors(score: Score): {backgroundColor: string; textColor: string} {
  if (score === NO_SCORE) {
    return {backgroundColor: SCORE_GRAY, textColor: '#000000'};
  } else if (score.value <= 2) {
    return {backgroundColor: SCORE_WHITE, textColor: '#000000'};
  } else if (score.value <= 4) {
    return {backgroundColor: SCORE_BLACK, textColor: '#ffffff'};
  } else if (score.value <= 6) {
    return {backgroundColor: SCORE_BLUE, textColor: '#ffffff'};
  } else if (score.value <= 8) {
    return {backgroundColor: SCORE_RED, textColor: '#ffffff'};
  }
  return {backgroundColor: SCORE_YELLOW, textColor: '#000000'};
}

function scoreSizes(size: ScoreSize): {width: number; fontSize: number} {
  if (size === 'small') {
    return {width: 24, fontSize: 16};
  }
  return {width: 48, fontSize: 32};
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const ScoreCircle: React.FC<ScoreCircleProps> = React.memo(props => {
  const {score = NO_SCORE, square, border, size = 'medium', style, ...rest} = props;

  const text = scoreText(score);
  const {backgroundColor, textColor} = scoreColors(score);
  const {width, fontSize} = scoreSizes(size);
  const borderRadius = square ? 0 : width / 2;
  const borderWidth = border ? 1 : 0;
  const borderColor = textColor;

  return (
    <Wrapper
      style={[
        {
          backgroundColor,
          borderRadius,
          width,
          height: width,
          borderColor,
          borderWidth,
        },
        style,
      ]}
      {...rest}
    >
      <StyledText style={{color: textColor, fontSize}}>{text}</StyledText>
    </Wrapper>
  );
});
ScoreCircle.displayName = 'ScoreCircle';

const Wrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled(Text)`
  font-weight: 600;
`;
