import React from 'react';
import {processColor, Text, View} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import styled from 'styled-components';

import {Session} from './models';
import {scoreColors} from './score_circle';
import {endAverage, endScore, isEndFull} from './session';

export const SCORE_FORM_HEIGHT = 300;

interface SessionEndChartProps {
  session: Session;
}

export const SessionEndChart: React.FC<SessionEndChartProps> = React.memo(props => {
  const {session} = props;

  const ends = session.ends
    .map((end, index) => ({index, end}))
    .filter(({end}) => isEndFull(session, end))
    .map(end => ({...end, score: endScore(end.end)?.value}));

  return (
    <Wrapper>
      <ChartTitle>{`Évolution des ${ends.length} volées`}</ChartTitle>
      <BarChart
        style={{height: 200}}
        data={{
          dataSets: [
            {
              values: ends.map(({score}) => ({y: score})),
              label: 'Score',
              config: {
                colors: ends.map(({end}) =>
                  processColor(scoreColors(endAverage(end)).backgroundColor)
                ),
                valueTextSize: 12,
                highlightEnabled: false,
                valueFormatter: ends.map(({score}) => `${score} pts`),
              },
            },
          ],
        }}
        yAxis={{
          left: {enabled: false, drawGridLines: false, axisMinimum: 0},
          right: {enabled: false, drawGridLines: false, axisMinimum: 0},
        }}
        xAxis={{
          valueFormatter: ends.map(({index}) => `#${index + 1}`),
          position: 'BOTTOM',
          drawGridLines: false,
          labelCount: ends.length,
          fontWeight: '500' as unknown as number,
          textSize: 12,
        }}
        legend={{enabled: false}}
        doubleTapToZoomEnabled={false}
      />
    </Wrapper>
  );
});
SessionEndChart.displayName = 'SessionEndChart';

const Wrapper = styled(View)`
  padding: 8px 0;
`;

const ChartTitle = styled(Text)`
  text-align: center;
  font-weight: 500;
  font-size: 16px;
`;
