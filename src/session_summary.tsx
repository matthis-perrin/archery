import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {EndCircle} from './end_circle';
import {EndLine} from './end_line';
import {Session} from './models';
import {ScoreCircle} from './score_circle';
import {
  averageByArrow,
  averageByEnd,
  bestEnd,
  scoreAverage,
  sessionScore,
  worstEnd,
} from './session';

export const SCORE_FORM_HEIGHT = 300;

interface SessionSummaryProps {
  session: Session;
}

export const SessionSummary: React.FC<SessionSummaryProps> = React.memo(props => {
  const {session} = props;

  const endAvg = averageByEnd(session);
  const arrowAvg = averageByArrow(session);
  const best = bestEnd(session);
  const worst = worstEnd(session);

  return (
    <Wrapper>
      <Total>{`${sessionScore(session)?.value ?? 0} pts`}</Total>
      <Line>
        <Label>Moyenne par volée</Label>
        <Value>
          <EndCircle total={endAvg} avg={scoreAverage(endAvg, session.endSize)} precision={1} />
        </Value>
      </Line>
      <Line>
        <Label>Moyenne par flèche</Label>
        <Value>
          <ScoreCircle score={arrowAvg} size="small" precision={1} />
        </Value>
      </Line>
      <Line>
        <Label>Meilleurs volée</Label>
        <EndLine end={best.end} endIndex={best.index} />
      </Line>
      <Line>
        <Label>Moins bonne volée</Label>
        <EndLine end={worst.end} endIndex={worst.index} />
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
