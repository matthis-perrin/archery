import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components';

import {Screen} from './fragments';
import {Session} from './models';
import {NoSession} from './no_session';
import {SessionTile} from './session_tile';
import {useSessions} from './stores';

export const HomeScreen: React.FC = () => {
  const sessions = useSessions();
  const renderItem = useCallback(({item}: {item: Session}) => <SessionTile session={item} />, []);
  const keyExtractor = useCallback((item: Session) => item.id, []);

  return (
    <Wrapper>
      <FlatList<Session>
        data={[...sessions.values()]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={NoSession}
      />
    </Wrapper>
  );
};
HomeScreen.displayName = 'HomeScreen';

const Wrapper = styled(Screen)``;
