import {RouteProp, useRoute} from '@react-navigation/native';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, Text, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

import {RouteParams} from './app';
import {TextButton} from './button';
import {padNumber} from './format';
import {LightText, Screen} from './fragments';
import {replaceAt} from './immutable';
import {ScoreCircle} from './score_circle';
import {ScoreForm} from './score_form';
import {endScore, newEnd} from './session';
import {setSession, useSession} from './stores';
import {TouchableWithData} from './touchable_with_data';

interface SelectedArrow {
  end: number;
  arrow: number;
}

export const SessionScreen: React.FC = React.memo(() => {
  const {
    params: {sessionId},
  } = useRoute<RouteProp<RouteParams, 'Session'>>();

  const session = useSession(sessionId);
  const [currentArrow, setCurrentArrow] = useState<SelectedArrow | undefined>();
  // const [currentEnd, setCurrentEnd] = useState<End | undefined>();
  // eslint-disable-next-line no-null/no-null
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAdd = useCallback(() => {
    if (session === undefined) {
      return;
    }
    setSession(session.id, {...session, ends: [...session.ends, newEnd(session)]});
    setCurrentArrow({end: session.ends.length, arrow: 0});
  }, [session]);

  const handleSelect = useCallback(
    (score: number) => {
      if (session === undefined || currentArrow === undefined) {
        return;
      }
      const {end, arrow} = currentArrow;
      const endToUpdate = session.ends[end];
      if (endToUpdate === undefined) {
        return;
      }

      const newEnd = {
        ...endToUpdate,
        scores: replaceAt(endToUpdate.scores, arrow, {value: score}),
      };
      const newSession = {
        ...session,
        ends: replaceAt(session.ends, end, newEnd),
      };
      setSession(session.id, newSession);

      if (arrow < session.endSize - 1) {
        setCurrentArrow({end, arrow: arrow + 1});
      } else if (end < session.ends.length - 1) {
        setCurrentArrow({end: end + 1, arrow: 0});
      } else {
        setCurrentArrow(undefined);
      }
    },
    [currentArrow, session]
  );

  const handleSelectScore = useCallback((arrow: SelectedArrow) => {
    setCurrentArrow(current => {
      const alreadySelected = arrow.end === current?.end && arrow.arrow === current.arrow;
      return alreadySelected ? undefined : arrow;
    });
  }, []);

  const handleGlobalPress = useCallback(() => {
    setCurrentArrow(undefined);
  }, []);

  const prev = useRef(currentArrow);
  useEffect(() => {
    if (prev.current === undefined && currentArrow !== undefined && scrollViewRef.current) {
      // Code to run once the bottom form is opened
      scrollViewRef.current.scrollToEnd();
    }
    prev.current = currentArrow;
  }, [currentArrow]);

  if (session === undefined) {
    return <Wrapper>Session introuvable</Wrapper>;
  }

  const start = new Date(session.ts);
  const day = start.toLocaleDateString();
  const time = `${padNumber(start.getHours(), 2)}h${padNumber(start.getMinutes(), 2)}`;

  let total = 0;
  const totals: number[] = [];
  for (const end of session.ends) {
    total += endScore(end);
    totals.push(total);
  }

  return (
    <Wrapper>
      <ScrollView ref={scrollViewRef}>
        <TouchableWithoutFeedback onPress={handleGlobalPress}>
          <Top>
            <Header>
              <HeaderLeft>
                <Text>30m</Text>
                <Text>Ø45</Text>
                <Text>➴➴➴</Text>
              </HeaderLeft>
              <HeaderRight>
                <Text>{`${day} - ${time}`}</Text>
              </HeaderRight>
            </Header>
            <Title>{new Date(session.ts).toLocaleString()}</Title>
            <Sheet>
              <Row>
                <DeleteCell></DeleteCell>
                <NumberCell>
                  <Text>#</Text>
                </NumberCell>
                <EndCell>
                  <Text>Flèches</Text>
                </EndCell>
                <ScoreCell>
                  <Text>Volée</Text>
                </ScoreCell>
                <TotalCell>
                  <Text>Total</Text>
                </TotalCell>
              </Row>
              {session.ends.map((end, endIndex) => {
                const endSelected = endIndex === currentArrow?.end;
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Row key={endIndex} style={{zIndex: endSelected ? 1 : undefined}}>
                    <DeleteCell></DeleteCell>
                    <NumberCell>
                      <Text>{endIndex + 1}</Text>
                    </NumberCell>
                    <EndCell>
                      {[...new Array(session.endSize)].map((v, scoreIndex) => {
                        const arrowSelected = endSelected && scoreIndex === currentArrow.arrow;
                        return (
                          <TouchableWithData
                            // eslint-disable-next-line react/no-array-index-key
                            key={scoreIndex}
                            data={{end: endIndex, arrow: scoreIndex}}
                            onPress={handleSelectScore}
                          >
                            <View
                              style={{
                                padding: 4,
                                // borderWidth: 1,
                                // borderColor: arrowSelected ? '#ff0000' : '#000000',
                                backgroundColor: arrowSelected ? '#ffffff33' : '#00000000',
                                marginRight: -1,
                                marginBottom: -1,
                                zIndex: arrowSelected ? 1 : undefined,
                              }}
                            >
                              <ScoreCircle
                                score={end.scores[scoreIndex]}
                                // square
                                // border
                                // selected={arrowSelected}
                                size="small"
                              />
                            </View>
                          </TouchableWithData>
                        );
                      })}
                    </EndCell>
                    <ScoreCell>
                      <Text>{endScore(end)}</Text>
                    </ScoreCell>
                    <TotalCell>
                      <Text>{totals[endIndex]}</Text>
                    </TotalCell>
                  </Row>
                );
              })}
            </Sheet>
            <TextButton title="Nouvelle volée" onPress={handleAdd} />
          </Top>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Bottom>{currentArrow ? <ScoreForm onSelect={handleSelect} /> : <Fragment />}</Bottom>
    </Wrapper>
  );
});
SessionScreen.displayName = 'SessionScreen';

const Wrapper = styled(Screen)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Top = styled(View)`
  padding: 24px;
`;
const Bottom = styled(View)``;

const Title = styled(LightText)`
  font-size: 24px;
  text-align: center;
`;

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff77;
`;

const HeaderLeft = styled(View)`
  display: flex;
  flex-direction: row;
`;
const HeaderRight = styled(View)``;

const Sheet = styled(View)`
  display: flex;
  background-color: #ffffff77;
`;

const Row = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const DeleteCell = styled(View)`
  width: 32px;
`;
const NumberCell = styled(View)`
  width: 32px;
`;
const EndCell = styled(View)`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;
const ScoreCell = styled(View)`
  width: 48px;
`;
const TotalCell = styled(View)`
  width: 48px;
`;
