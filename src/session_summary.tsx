import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {Session} from './models';
import {averageByEnd, sessionScore} from './session';

export const SCORE_FORM_HEIGHT = 300;

interface SessionSummaryProps {
  session: Session;
}

export const SessionSummary: React.FC<SessionSummaryProps> = React.memo(props => {
  const {session} = props;

  return (
    <Wrapper>
      <Total>{`${sessionScore(session)} pts`}</Total>
      <Line>
        <Label>Moyenne par volée</Label>
        <Value>{Math.round(10 * averageByEnd(session)) / 10}</Value>
      </Line>
    </Wrapper>
  );
});
SessionSummary.displayName = 'SessionSummary';

const Wrapper = styled(View)``;
const Total = styled(Text)`
  font-size: 64px;
  text-align: center;
`;

const Line = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled(Text)``;
const Value = styled(Text)``;
