import React, {Fragment, useCallback, useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

import {DistancePicker} from './distance_picker';
import {EndSizePicker} from './end_size_picker';
import {padNumber} from './format';
import {Modal} from './modal';
import {EndSize, Session} from './models';
import {Spacing} from './spacing';
import {setSession} from './stores';

export const SCORE_FORM_HEIGHT = 300;

interface SessionHeaderProps {
  session: Session;
}

export const SessionHeader: React.FC<SessionHeaderProps> = React.memo(props => {
  const {session} = props;
  const [modalShown, setModalShown] = useState(false);

  const handlePress = useCallback(() => {
    setModalShown(true);
  }, []);
  const handleDismiss = useCallback(() => {
    setModalShown(false);
  }, []);

  const start = new Date(session.ts);
  const day = start.toLocaleDateString();
  const time = `${padNumber(start.getHours(), 2)}h${padNumber(start.getMinutes(), 2)}`;

  const handleEndSizeChange = useCallback(
    (newEndSize: EndSize) => {
      setSession(session.id, {...session, endSize: newEndSize});
    },
    [session]
  );

  const handleDistanceChange = useCallback(
    (newDistance: number) => {
      setSession(session.id, {...session, distance: newDistance});
    },
    [session]
  );

  return (
    <Fragment>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Header>
          <HeaderLeft>
            <Text>{`${session.distance}m`}</Text>
            <Text>{session.diameter}</Text>
            <Text>{[...new Array(session.endSize)].map(() => `➴`).join('')}</Text>
          </HeaderLeft>
          <HeaderRight>
            <Text>{`${day} - ${time}`}</Text>
          </HeaderRight>
        </Header>
      </TouchableWithoutFeedback>
      <Modal shown={modalShown} onDismiss={handleDismiss}>
        <Form>
          <FormLine>
            <FormLabel>Flèches par volée</FormLabel>
            <EndSizePicker endSize={session.endSize} onChange={handleEndSizeChange} />
          </FormLine>
          <Spacing height={16} />
          <FormLine>
            <FormLabel>Distance</FormLabel>
          </FormLine>
          <Spacing height={8} />
          <FormLine>
            <DistancePicker distance={session.distance} onChange={handleDistanceChange} />
          </FormLine>
        </Form>
      </Modal>
    </Fragment>
  );
});
SessionHeader.displayName = 'SessionHeader';

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff77;
  padding: 8px;
`;

const HeaderLeft = styled(View)`
  display: flex;
  flex-direction: row;
`;
const HeaderRight = styled(View)``;

const Form = styled(View)`
  display: flex;
  padding: 16px;
  background-color: #ffffffcc;
  border-radius: 8px;
  width: 95%;
`;

const FormLine = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FormLabel = styled(Text)`
  font-size: 16px;
  font-weight: 500;
`;
