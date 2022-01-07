import React from 'react';
import {Modal as NativeModal, ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

import {useSafePaddings} from './use_safe_paddings';

interface ModalProps {
  shown: boolean;
  onDismiss: () => void;
}

export const Modal: React.FC<ModalProps> = ({shown, onDismiss, children}) => {
  const paddings = useSafePaddings();

  const handleBackdropPress = onDismiss;

  return (
    <NativeModal
      animationType="fade"
      visible={shown}
      /* eslint-disable react/jsx-handler-names */
      onRequestClose={onDismiss}
      onDismiss={onDismiss}
      /* eslint-enable react/jsx-handler-names */
      transparent
    >
      <Wrapper>
        <ScrollView style={{...paddings}}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <Inner>
              <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
            </Inner>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Wrapper>
    </NativeModal>
  );
};
Modal.displayName = 'Modal';

const Wrapper = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000000cc;
  z-index: 10;
`;

const Inner = styled(View)`
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
