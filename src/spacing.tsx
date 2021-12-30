import React, {FC} from 'react';
import {View} from 'react-native';

export const Spacing: FC<{height?: number; width?: number}> = ({
  width = '100%',
  height = '100%',
}) => <View style={{width, height}} />;
Spacing.displayName = 'Spacing';
