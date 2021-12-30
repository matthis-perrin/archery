import React from 'react';
import {Text, View, ViewProps} from 'react-native';
import styled from 'styled-components';

import {SCORE_BLACK, SCORE_BLUE, SCORE_GRAY, SCORE_RED, SCORE_WHITE, SCORE_YELLOW} from './colors';
import {NO_SCORE, Score} from './models';

type ScoreSize = 'small' | 'medium';

interface ScoreCircleProps extends ViewProps {
  score?: Score;
  square?: boolean;
  border?: boolean;
  size?: ScoreSize;
  precision?: number;
}

export function scoreText(score: Score, precision: number): string {
  if (score === NO_SCORE) {
    return '';
  }
  return score.value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/* eslint-disable @typescript-eslint/no-magic-numbers */
export function scoreColors(score: Score): {backgroundColor: string; textColor: string} {
  if (score === NO_SCORE) {
    return {backgroundColor: SCORE_GRAY, textColor: '#000000'};
  } else if (score.value < 3) {
    return {backgroundColor: SCORE_WHITE, textColor: '#000000'};
  } else if (score.value < 5) {
    return {backgroundColor: SCORE_BLACK, textColor: '#ffffff'};
  } else if (score.value < 7) {
    return {backgroundColor: SCORE_BLUE, textColor: '#ffffff'};
  } else if (score.value < 9) {
    return {backgroundColor: SCORE_RED, textColor: '#ffffff'};
  }
  return {backgroundColor: SCORE_YELLOW, textColor: '#000000'};
}

function scoreSizes(size: ScoreSize): {height: number; fontSize: number} {
  if (size === 'small') {
    return {height: 24, fontSize: 16};
  }
  return {height: 48, fontSize: 32};
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const ScoreCircle: React.FC<ScoreCircleProps> = React.memo(props => {
  const {score = NO_SCORE, precision = 0, square, border, size = 'medium', style, ...rest} = props;

  const text = scoreText(score, precision);
  const {backgroundColor, textColor} = scoreColors(score);
  const {height, fontSize} = scoreSizes(size);
  const width = height * (1 + precision / 2);
  const borderRadius = square ? 0 : height / 2;
  const borderWidth = border ? 1 : 0;
  const borderColor = textColor;

  return (
    <Wrapper
      style={[
        {
          backgroundColor,
          borderRadius,
          width,
          height,
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
