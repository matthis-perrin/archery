import React, {Fragment, useCallback, useMemo} from 'react';
import {SectionList, SectionListData, View} from 'react-native';
import styled from 'styled-components';

import {LightText, Screen} from './fragments';
import {Session} from './models';
import {NewSessionButton} from './new_session_button';
import {NoSession} from './no_session';
import {sessionDay, sortSessions} from './session';
import {SessionTile} from './session_tile';
import {useSessions} from './stores';

export const HomeScreen: React.FC = () => {
  const sessions = useSessions();
  const sessionByDay = useMemo(() => {
    const groups = new Map<number, Session[]>();
    for (const session of sortSessions(sessions)) {
      const day = sessionDay(session);
      let group = groups.get(day);
      if (group === undefined) {
        group = [];
        groups.set(day, group);
      }
      group.push(session);
    }
    return [...groups.entries()].map(([day, sessions]) => ({day, data: sessions}));
  }, [sessions]);

  const renderItem = useCallback(({item}: {item: Session}) => <SessionTile session={item} />, []);
  const renderSectionHeader = useCallback(
    (info: {section: SectionListData<Session, {day: number}>}) => (
      <SectionHeader>
        <LightText>{new Date(info.section.day).toLocaleDateString()}</LightText>
      </SectionHeader>
    ),
    []
  );
  const keyExtractor = useCallback((item: Session) => item.id, []);

  return (
    <Wrapper>
      <SectionList<Session, {day: number}>
        sections={sessionByDay}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{flexGrow: 1, paddingVertical: 32, paddingHorizontal: 16}}
        ListHeaderComponent={sessionByDay.length === 0 ? <Fragment /> : NewSessionButton}
        ListEmptyComponent={NoSession}
        ItemSeparatorComponent={SessionSeparator}
        SectionSeparatorComponent={SessionSeparator}
        stickySectionHeadersEnabled={false}
      />
    </Wrapper>
  );
};
HomeScreen.displayName = 'HomeScreen';

const Wrapper = styled(Screen)``;
const SessionSeparator = styled(View)`
  height: 5px;
`;
const SectionHeader = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;
