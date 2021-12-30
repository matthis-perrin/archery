import React from 'react';
import {processColor, Text, View} from 'react-native';
import {BarChart} from 'react-native-charts-wrapper';
import styled from 'styled-components';

import {NO_SCORE, Session} from './models';
import {scoreColors} from './score_circle';

export const SCORE_FORM_HEIGHT = 300;

interface SessionArrowChartProps {
  session: Session;
}

export const SessionArrowChart: React.FC<SessionArrowChartProps> = React.memo(props => {
  const {session} = props;

  let total = 0;
  const arrowCount = new Map<number, number>();
  for (const end of session.ends) {
    for (const score of end.scores) {
      if (score === NO_SCORE) {
        continue;
      }
      const currentCount = arrowCount.get(score.value) ?? 0;
      total++;
      arrowCount.set(score.value, currentCount + 1);
    }
  }

  return (
    <Wrapper>
      <ChartTitle>{`Répartition des ${total} flèches`}</ChartTitle>
      <BarChart
        style={{height: 200}}
        data={{
          dataSets: [
            {
              values: [...new Array(10)].map((v, i) => {
                const x = 10 - i;
                const y = arrowCount.get(x) ?? 0;
                return {y};
              }),
              label: 'Nombre de flèches',
              config: {
                colors: [...new Array(10)].map((v, i) =>
                  processColor(scoreColors({value: 10 - i}).backgroundColor)
                ),
                valueTextSize: 12,
                highlightEnabled: false,
                valueFormatter: [...new Array(10)].map((v, i) =>
                  String(arrowCount.get(10 - i) ?? 0)
                ),
              },
            },
          ],
        }}
        yAxis={{
          left: {enabled: false, drawGridLines: false, axisMinimum: 0},
          right: {enabled: false, drawGridLines: false, axisMinimum: 0},
        }}
        xAxis={{
          valueFormatter: [...new Array(10)].map((v, i) => `${String(10 - i)}pts`),
          position: 'BOTTOM',
          drawGridLines: false,
          labelCount: 10,
          fontWeight: '500' as unknown as number,
          textSize: 12,
        }}
        legend={{enabled: false}}
        doubleTapToZoomEnabled={false}
      />
    </Wrapper>
  );
});
SessionArrowChart.displayName = 'SessionArrowChart';

const Wrapper = styled(View)`
  padding: 8px 0;
`;

const ChartTitle = styled(Text)`
  text-align: center;
  font-weight: 500;
  font-size: 16px;
`;
