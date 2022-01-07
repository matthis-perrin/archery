import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {MY_PURPLE, MY_YELLOW} from './colors';
import {TouchableWithData} from './touchable_with_data';

interface DistancePickerProps {
  distance: number;
  onChange: (newDistance: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const ALL_DISTANCES = [10, 18, 20, 25, 30, 40, 50, 60, 70, 90];

export const DistancePicker: React.FC<DistancePickerProps> = ({distance, onChange}) => {
  return (
    <Wrapper>
      {ALL_DISTANCES.map(d => (
        // eslint-disable-next-line react/jsx-handler-names
        <TouchableWithData key={d} data={d} onPress={onChange}>
          <Item selected={d === distance}>
            <ItemText selected={d === distance}>{`${d}m`}</ItemText>
          </Item>
        </TouchableWithData>
      ))}
    </Wrapper>
  );
};
DistancePicker.displayName = 'DistancePicker';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Item = styled(View)<{selected?: boolean}>`
  width: 48px;
  height: 32px;
  background-color: ${p => (!p.selected ? MY_YELLOW : MY_PURPLE)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 0 8px 8px 0;
`;

const ItemText = styled(Text)<{selected?: boolean}>`
  font-size: 16px;
  color: ${p => (!p.selected ? '#000000' : '#ffffff')};
`;
