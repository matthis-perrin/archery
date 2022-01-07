import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components';

import {MY_PURPLE, MY_YELLOW} from './colors';
import {FitaTarget} from './fita_target';
import {TargetType} from './models';
import {TouchableWithData} from './touchable_with_data';

interface TargetPickerProps {
  target: TargetType;
  onChange: (newTarget: TargetType) => void;
}

const ALL_TARGETS: {target: TargetType; jsx: JSX.Element; label: string}[] = [
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  {target: TargetType.Fita45, jsx: <FitaTarget size={45 * 0.66} />, label: '45'},
  {target: TargetType.Fita60, jsx: <FitaTarget size={60 * 0.66} />, label: '60'},
  {target: TargetType.Fita80, jsx: <FitaTarget size={80 * 0.66} />, label: '80'},
  {target: TargetType.Fita122, jsx: <FitaTarget size={122 * 0.66} />, label: '122'},
  /* eslint-enable @typescript-eslint/no-magic-numbers */
];

export const TargetPicker: React.FC<TargetPickerProps> = ({target, onChange}) => {
  return (
    <Wrapper>
      {ALL_TARGETS.map(({target: t, jsx, label}) => (
        // eslint-disable-next-line react/jsx-handler-names
        <TouchableWithData key={t} data={t} onPress={onChange}>
          <Item selected={t === target}>
            {jsx}
            <ItemText selected={t === target}>{label}</ItemText>
          </Item>
        </TouchableWithData>
      ))}
    </Wrapper>
  );
};
TargetPicker.displayName = 'TargetPicker';

const Wrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
`;

const Item = styled(View)<{selected?: boolean}>`
  background-color: ${p => (!p.selected ? MY_YELLOW : MY_PURPLE)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 0 8px 8px 0;
  padding: 8px;
`;

const ItemText = styled(Text)<{selected?: boolean}>`
  font-size: 16px;
  color: ${p => (!p.selected ? '#000000' : '#ffffff')};
  margin-top: 8px;
`;
