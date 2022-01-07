import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {MY_PURPLE, MY_YELLOW} from './colors';
import {ALL_END_SIZE, EndSize} from './models';
import {TouchableWithData} from './touchable_with_data';

interface EndSizePickerProps {
  endSize: EndSize;
  onChange: (newEndSize: EndSize) => void;
}

export const EndSizePicker: React.FC<EndSizePickerProps> = ({endSize, onChange}) => {
  return (
    <Wrapper>
      {ALL_END_SIZE.map(size => (
        // eslint-disable-next-line react/jsx-handler-names
        <TouchableWithData key={size} data={size} onPress={onChange}>
          <Item selected={endSize === size}>
            <ItemText selected={endSize === size}>{size}</ItemText>
          </Item>
        </TouchableWithData>
      ))}
    </Wrapper>
  );
};
EndSizePicker.displayName = 'EndSizePicker';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Item = styled(View)<{selected?: boolean}>`
  width: 32px;
  height: 32px;
  background-color: ${p => (!p.selected ? MY_YELLOW : MY_PURPLE)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: 8px;
`;

const ItemText = styled(Text)<{selected?: boolean}>`
  font-size: 16px;
  color: ${p => (!p.selected ? '#000000' : '#ffffff')};
`;
