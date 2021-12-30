import React, {useCallback, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import styled from 'styled-components';

import {Screen} from './fragments';
import {Session} from './models';
import {NoSession} from './no_session';
import {sortSessions} from './session';
import {SessionTile} from './session_tile';
import {useSessions} from './stores';

export const HomeScreen: React.FC = () => {
  const sessions = useSessions();
  const sortedSession = useMemo(() => sortSessions(sessions), [sessions]);

  const renderItem = useCallback(({item}: {item: Session}) => <SessionTile session={item} />, []);
  const keyExtractor = useCallback((item: Session) => item.id, []);

  return (
    <Wrapper>
      <FlatList<Session>
        data={sortedSession}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1, paddingVertical: 32, paddingHorizontal: 16}}
        ListEmptyComponent={NoSession}
        ItemSeparatorComponent={SessionSeparator}
      />
    </Wrapper>
  );
};
HomeScreen.displayName = 'HomeScreen';

const Wrapper = styled(Screen)``;
const SessionSeparator = styled(View)`
  height: 5px;
`;
