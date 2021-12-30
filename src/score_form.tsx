import React, {useMemo} from 'react';
import {Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';

import {SCORE_WHITE} from './colors';
import {ScoreCircle} from './score_circle';

export const SCORE_FORM_HEIGHT = 300;

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

  function renderButton(value: number): JSX.Element {
    return (
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'#ffffff33'}
        onPress={handleScorePressed[String(value)]}
      >
        <ScoreButton>
          <ScoreCircle score={{value}} />
        </ScoreButton>
      </TouchableHighlight>
    );
  }

  return (
    <Wrapper>
      {/* eslint-disable @typescript-eslint/no-magic-numbers */}
      <Line>
        {renderButton(10)}
        {renderButton(9)}
        {renderButton(8)}
        {renderButton(7)}
      </Line>
      <Line>
        {renderButton(6)}
        {renderButton(5)}
        {renderButton(4)}
        {renderButton(3)}
      </Line>
      <Line>
        {renderButton(2)}
        {renderButton(1)}
        <TouchableOpacity onPress={handleScorePressed['0']}>
          <ZeroButton>
            <ZeroTextWrapper>
              <ZeroText>Paille :(</ZeroText>
            </ZeroTextWrapper>
          </ZeroButton>
        </TouchableOpacity>
      </Line>
      {/* eslint-enable @typescript-eslint/no-magic-numbers */}
    </Wrapper>
  );
});
ScoreForm.displayName = 'ScoreForm';

const Wrapper = styled(View)`
  display: flex;
  height: ${SCORE_FORM_HEIGHT}px;
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
