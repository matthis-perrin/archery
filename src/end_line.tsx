import React from 'react';
import {Text, View, ViewProps} from 'react-native';
import styled from 'styled-components';

import {EndCircle} from './end_circle';
import {End} from './models';
import {ScoreCircle} from './score_circle';
import {endAverage, endScore} from './session';

interface EndLineProps extends ViewProps {
  end: End;
  endIndex: number;
}

export const EndLine: React.FC<EndLineProps> = React.memo(props => {
  const {end, endIndex, style, ...rest} = props;

  return (
    <Wrapper style={style} {...rest}>
      <EndNumber>{`#${endIndex + 1}`}</EndNumber>
      {end.scores.map((s, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ScoreCircle key={i} size="small" score={s} />
      ))}
      <EndCircle total={endScore(end)} avg={endAverage(end)} />
    </Wrapper>
  );
});
EndLine.displayName = 'EndLine';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const EndNumber = styled(Text)`
  font-weight: 600;
  width: 48px;
  text-align: center;
`;
