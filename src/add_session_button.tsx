import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';

import {generateSessionId, Session} from './models';
import {setSession} from './stores';

export const AddSessionButton = (): JSX.Element => {
  const handleIconPress = useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: Session = {
      id: newSessionId,
      ends: [],
      ts: Date.now(),
    };
    setSession(newSessionId, newSession);
  }, []);
  return (
    <TouchableOpacity onPress={handleIconPress}>
      <Svg width={20} height={20} fill={'black'} viewBox="137.2 67.2 425.6 425.6">
        <Path d="M316.4 67.2v179.2H137.2v67.2h179.2v179.2h67.2V313.6h179.2v-67.2H383.6V67.2z" />
      </Svg>
    </TouchableOpacity>
  );
};
AddSessionButton.displayName = 'AddSessionButton';
