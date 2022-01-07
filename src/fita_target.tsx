import React from 'react';
import {View, ViewProps} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

import {SCORE_BLACK, SCORE_BLUE, SCORE_RED, SCORE_WHITE, SCORE_YELLOW} from './colors';

interface FitaTargetProps extends ViewProps {
  size: number;
  transparent?: boolean;
}

export const FitaTarget: React.FC<FitaTargetProps> = ({size, transparent, style, ...rest}) => {
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  const circleCenter = {cx: size / 2, cy: size / 2};
  const radiusUnit = size / 20;
  const strokeWidth = size / 200;

  return (
    <View
      style={[
        style,
        {
          width: size,
          height: size,
          backgroundColor: transparent ? undefined : '#ffffff',
        },
      ]}
      {...rest}
    >
      <Svg>
        <Circle
          {...circleCenter}
          r={10 * radiusUnit}
          fill={SCORE_WHITE}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={9 * radiusUnit}
          fill={SCORE_WHITE}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={8 * radiusUnit}
          fill={SCORE_BLACK}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={7 * radiusUnit}
          fill={SCORE_BLACK}
          strokeWidth={strokeWidth}
          stroke="#ffffff"
        />
        <Circle
          {...circleCenter}
          r={6 * radiusUnit}
          fill={SCORE_BLUE}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={5 * radiusUnit}
          fill={SCORE_BLUE}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={4 * radiusUnit}
          fill={SCORE_RED}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={3 * radiusUnit}
          fill={SCORE_RED}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={2 * radiusUnit}
          fill={SCORE_YELLOW}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={radiusUnit}
          fill={SCORE_YELLOW}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle
          {...circleCenter}
          r={radiusUnit / 2}
          fill={SCORE_YELLOW}
          strokeWidth={strokeWidth}
          stroke="#000000"
        />
        <Circle {...circleCenter} r={strokeWidth} fill="#000000" />
      </Svg>
    </View>
  );
  /* eslint-enable @typescript-eslint/no-magic-numbers */
};
FitaTarget.displayName = 'FitaTarget';
