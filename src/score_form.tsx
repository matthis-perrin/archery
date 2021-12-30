import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';

import {SCORE_WHITE} from './colors';
import {ScoreCircle} from './score_circle';

interface ScoreFormProps {
  onSelect: (value: number) => void;
}

export const ScoreForm: React.FC<ScoreFormProps> = React.memo(props => {
  const {onSelect} = props;
  const handleScorePressed = useMemo(
    () =>
      Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => [score, () => onSelect(score)])
      ),
    [onSelect]
  );
  return (
    <Wrapper>
      <Line>
        <TouchableOpacity onPress={handleScorePressed['10']}>
          <ScoreButton>
            <ScoreCircle score={{value: 10}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['9']}>
          <ScoreButton>
            <ScoreCircle score={{value: 9}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['8']}>
          <ScoreButton>
            <ScoreCircle score={{value: 8}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['7']}>
          <ScoreButton>
            <ScoreCircle score={{value: 7}} />
          </ScoreButton>
        </TouchableOpacity>
      </Line>
      <Line>
        <TouchableOpacity onPress={handleScorePressed['6']}>
          <ScoreButton>
            <ScoreCircle score={{value: 6}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['5']}>
          <ScoreButton>
            <ScoreCircle score={{value: 5}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['4']}>
          <ScoreButton>
            <ScoreCircle score={{value: 4}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['3']}>
          <ScoreButton>
            <ScoreCircle score={{value: 3}} />
          </ScoreButton>
        </TouchableOpacity>
      </Line>
      <Line>
        <TouchableOpacity onPress={handleScorePressed['2']}>
          <ScoreButton>
            <ScoreCircle score={{value: 2}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['1']}>
          <ScoreButton>
            <ScoreCircle score={{value: 1}} />
          </ScoreButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScorePressed['0']}>
          <ZeroButton>
            <ZeroTextWrapper>
              <ZeroText>Paille :(</ZeroText>
            </ZeroTextWrapper>
          </ZeroButton>
        </TouchableOpacity>
      </Line>
    </Wrapper>
  );
});
ScoreForm.displayName = 'ScoreForm';

const Wrapper = styled(View)`
  display: flex;
  background-color: #ffffff88;
`;

const Line = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const buttonWidth = 90;

const Button = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
`;

const ScoreButton = styled(Button)`
  width: 90px;
`;

const ZeroButton = styled(Button)`
  width: 180px;
`;

const SCORE_SIZE = 48;

const ZeroTextWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${SCORE_WHITE};
  height: ${SCORE_SIZE}px;
  border-radius: ${SCORE_SIZE / 2}px;
  width: ${SCORE_SIZE * 2 + (buttonWidth - SCORE_SIZE)}px;
`;

const ZeroText = styled(Text)`
  font-size: 24px;
  font-weight: 600;
`;
