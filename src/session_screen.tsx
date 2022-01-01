import {RouteProp, useRoute} from '@react-navigation/native';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import {EndCircle} from './end_circle';
import {LightText, Screen} from './fragments';
import {removeAt, replaceAt} from './immutable';
import {NO_SCORE} from './models';
import {useNav} from './navigation';
import {ScoreCircle} from './score_circle';
import {SCORE_FORM_HEIGHT, ScoreForm} from './score_form';
import {endAverage, endIsEmpty, endScore, isEndFull, newEnd, sessionIsEmpty} from './session';
import {SessionArrowChart} from './session_arrow_chart';
import {SessionEndChart} from './session_end_chart';
import {SessionSummary} from './session_summary';
import {Spacing} from './spacing';
import {deleteSession, setSession, useSession} from './stores';
import {TouchableWithData} from './touchable_with_data';

interface SelectedArrow {
  end: number;
  arrow: number;
}

export const SessionScreen: React.FC = React.memo(() => {
  const {
    params: {sessionId},
  } = useRoute<RouteProp<RouteParams, 'Session'>>();
  const nav = useNav();

  const session = useSession(sessionId);
  const lastEndIndex = (session?.ends.length ?? 0) - 1;
  const lastEnd = session?.ends[lastEndIndex];
  const [currentArrow, setCurrentArrow] = useState<SelectedArrow | undefined>(
    lastEnd !== undefined && endIsEmpty(lastEnd) ? {arrow: 0, end: lastEndIndex} : undefined
  );
  // eslint-disable-next-line no-null/no-null
  const scrollViewRef = useRef<ScrollView>(null);
  const endRowRefs = useRef(new Map<number, View>());

  // Add a new end to the session
  const handleAdd = useCallback(() => {
    if (session === undefined) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    setSession(session.id, {...session, ends: [...session.ends, newEnd(session.endSize)]});
    setCurrentArrow({end: session.ends.length, arrow: 0});
  }, [session]);

  // Delete the session entirely
  const deleteSessionAndRedirect = useCallback(() => {
    if (session === undefined) {
      return;
    }
    nav.navigate('Home');
    deleteSession(session.id);
  }, [nav, session]);
  const handleDeleteSession = useCallback(() => {
    if (session === undefined) {
      return;
    }
    if (session.ends.filter(end => !endIsEmpty(end)).length > 0) {
      Alert.alert(
        'Confirmation de suppression',
        'Êtes vous sûr de vouloir supprimer cette session ?',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {text: 'Oui, supprimer', onPress: () => deleteSessionAndRedirect()},
        ]
      );
    } else {
      deleteSessionAndRedirect();
    }
  }, [deleteSessionAndRedirect, session]);

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

      LayoutAnimation.easeInEaseOut();
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
      } else {
        const nextEnd = session.ends[end + 1];
        if (nextEnd !== undefined && nextEnd.scores[0] === NO_SCORE) {
          setCurrentArrow({end: end + 1, arrow: 0});
        } else {
          setCurrentArrow(undefined);
        }
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

  // Maintain a ref to the height of the sheet
  const sheetHeightRef = useRef(0);
  const handleSheetLayout = useCallback(evt => {
    sheetHeightRef.current = evt.nativeEvent.layout.height;
  }, []);

  //
  // Control the scroll offset when currentArrow is updated
  //
  const prev = useRef(currentArrow);
  const lastRowHeight = useRef(0);
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
      // Measure its position relative to the scrollview
      rowView?.measureLayout(
        scrollViewRef.current as unknown as HostComponent<unknown>,
        (x, y, width, height) => {
          // If the row has not been rendered, we scroll to center the bottom of the sheet
          const newOffset =
            width === 0 || height === 0
              ? sheetHeightRef.current - scrollViewHeightAfterAnim / 2 + lastRowHeight.current
              : y - (scrollViewHeightAfterAnim - height) / 2;
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: newOffset,
            animated: true,
          });
          if (height > 0) {
            lastRowHeight.current = height;
          }
        },
        () => {}
      );
    }

    // Update ref to keep track of previous selected arrow
    prev.current = currentArrow;
  }, [currentArrow]);

  if (session === undefined) {
    return (
      <Wrapper>
        <LightText>Session introuvable</LightText>
      </Wrapper>
    );
  }

  // const start = new Date(session.ts);
  // const day = start.toLocaleDateString();
  // const time = `${padNumber(start.getHours(), 2)}h${padNumber(start.getMinutes(), 2)}`;

  let total = 0;
  const totals: number[] = [];
  for (const end of session.ends) {
    total += endScore(end)?.value ?? 0;
    totals.push(total);
  }

  return (
    <Wrapper>
      <ScrollView style={{flexGrow: 1}} ref={scrollViewRef} onLayout={handleScrollViewLayout}>
        <TouchableWithoutFeedback onPress={handleGlobalPress}>
          <View style={{padding: 24, minHeight: '100%'}}>
            {/* <Header>
              <HeaderLeft>
                <Text>30m</Text>
                <Text>Ø45</Text>
                <Text>➴➴➴</Text>
              </HeaderLeft>
              <HeaderRight>
                <Text>{`${day} - ${time}`}</Text>
              </HeaderRight>
            </Header> */}
            {/* <Spacing height={32} /> */}
            <Sheet onLayout={handleSheetLayout}>
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
                      <EndCircle total={endScore(end)} avg={endAverage(end)} />
                    </ScoreCell>
                    <TotalCell>
                      <Text>{totals[endIndex]}</Text>
                    </TotalCell>
                  </Row>
                );
              })}
            </Sheet>
            <Spacing height={32} />
            <TextButton title="Nouvelle volée" onPress={handleAdd} />
            {sessionIsEmpty(session) ? (
              <React.Fragment />
            ) : (
              <React.Fragment>
                <Spacing height={32} />
                <Tile>
                  <SessionSummary session={session} />
                </Tile>
                <Spacing height={32} />
                <Tile>
                  <SessionArrowChart session={session} />
                </Tile>
              </React.Fragment>
            )}
            {session.ends.filter(end => isEndFull(session, end)).length < 2 ? (
              <React.Fragment />
            ) : (
              <React.Fragment>
                <Spacing height={32} />
                <Tile>
                  <SessionEndChart session={session} />
                </Tile>
              </React.Fragment>
            )}
            <Spacing height={32} />
            <TextButton title="Supprimer session" onPress={handleDeleteSession} />
          </View>
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
const Bottom = styled(View)`
  flex-shrink: 0;
`;

// const Header = styled(View)`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   background-color: #ffffff77;
// `;

// const HeaderLeft = styled(View)`
//   display: flex;
//   flex-direction: row;
// `;
// const HeaderRight = styled(View)``;

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

const Tile = styled(View)`
  background-color: #ffffff77;
`;
