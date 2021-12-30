import {RouteProp, useRoute} from '@react-navigation/native';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  HostComponent,
  LayoutAnimation,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled from 'styled-components';

import {RouteParams} from './app';
import {TextButton} from './button';
import {padNumber} from './format';
import {LightText, Screen} from './fragments';
import {removeAt, replaceAt} from './immutable';
import {ScoreCircle} from './score_circle';
import {SCORE_FORM_HEIGHT, ScoreForm} from './score_form';
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
  // eslint-disable-next-line no-null/no-null
  const scrollViewRef = useRef<ScrollView>(null);
  const endRowRefs = useRef(new Map<number, View>());

  // Add a new end to the session
  const handleAdd = useCallback(() => {
    if (session === undefined) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    setSession(session.id, {...session, ends: [...session.ends, newEnd(session)]});
    setCurrentArrow({end: session.ends.length, arrow: 0});
  }, [session]);

  // Remove an end from the session
  const handleRemove = useCallback(
    (index: number) => {
      if (session === undefined) {
        return;
      }
      LayoutAnimation.easeInEaseOut();
      setSession(session.id, {
        ...session,
        ends: removeAt(session.ends, index),
      });
      if (!currentArrow) {
        return;
      }
      if (currentArrow.end === index) {
        setCurrentArrow(undefined);
      } else if (currentArrow.end > index) {
        setCurrentArrow({...currentArrow, end: currentArrow.end - 1});
      }
    },
    [currentArrow, session]
  );

  // Assign a score to the currently selected arrow
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

  // Update the currently selected arrow
  const handleSelectScore = useCallback((arrow: SelectedArrow) => {
    LayoutAnimation.easeInEaseOut();
    setCurrentArrow(current => {
      const alreadySelected = arrow.end === current?.end && arrow.arrow === current.arrow;
      return alreadySelected ? undefined : arrow;
    });
  }, []);

  // Dismiss the current selection when pressing anywhere on the screen
  const handleGlobalPress = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setCurrentArrow(undefined);
  }, []);

  // Maintain a ref to the height of the scrollview
  const scrollViewHeight = useRef(0);
  const handleScrollViewLayout = useCallback((evt: LayoutChangeEvent) => {
    scrollViewHeight.current = evt.nativeEvent.layout.height;
  }, []);

  //
  // Control the scroll offset when currentArrow is updated
  //
  const prev = useRef(currentArrow);
  useEffect(() => {
    // Compute the height the scrollview will have after the animation
    const isOpening = currentArrow !== undefined && prev.current === undefined;
    const isClosing = currentArrow === undefined && prev.current !== undefined;
    let scrollViewHeightAfterAnim = scrollViewHeight.current;
    if (isOpening) {
      scrollViewHeightAfterAnim -= SCORE_FORM_HEIGHT;
    }
    if (isClosing) {
      scrollViewHeightAfterAnim += SCORE_FORM_HEIGHT;
    }

    // We will try to center the row that is currenly selected (or the
    // one that was previously selected when closing)
    const rowToCenter = currentArrow?.end ?? prev.current?.end;
    if (rowToCenter !== undefined && scrollViewRef.current) {
      // Get the ref to the view that we want to center
      const rowView = endRowRefs.current.get(rowToCenter);
      if (rowView === undefined) {
        scrollViewRef.current.scrollToEnd();
      } else {
        // Measure its position relative to the scrollview
        rowView.measureLayout(
          scrollViewRef.current as unknown as HostComponent<unknown>,
          (x, y, width, height) => {
            // Ensure the row has been rendered
            if (width === 0 || height === 0) {
              scrollViewRef.current?.scrollToEnd();
              return;
            }
            const newOffset = y - (scrollViewHeightAfterAnim - height) / 2;
            scrollViewRef.current?.scrollTo({
              x: 0,
              y: newOffset,
              animated: true,
            });
          },
          () => {}
        );
      }
    }

    // Update ref to keep track of previous selected arrow
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
      <TouchableWithoutFeedback onPress={handleGlobalPress}>
        <Top>
          <ScrollView ref={scrollViewRef} onLayout={handleScrollViewLayout}>
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
                  <Row
                    key={end.ts}
                    // eslint-disable-next-line react/jsx-no-bind
                    ref={ref => {
                      if (ref) {
                        endRowRefs.current.set(endIndex, ref);
                      }
                    }}
                    style={{zIndex: endSelected ? 1 : undefined}}
                  >
                    <DeleteCell>
                      <Button
                        // eslint-disable-next-line react/jsx-no-bind
                        onPress={() => handleRemove(endIndex)}
                        title={'x'}
                      ></Button>
                    </DeleteCell>
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
                                backgroundColor: arrowSelected ? '#ffffff33' : '#00000000',
                                marginRight: -1,
                                marginBottom: -1,
                                zIndex: arrowSelected ? 1 : undefined,
                              }}
                            >
                              <ScoreCircle score={end.scores[scoreIndex]} size="small" />
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
          </ScrollView>
        </Top>
      </TouchableWithoutFeedback>
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
  flex-grow: 1;
  flex-shrink: 1;
`;
const Bottom = styled(View)`
  flex-shrink: 0;
`;

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
