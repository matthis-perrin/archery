import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';

import {HomeScreen} from './home_screen';
import {Session} from './models';
import {SessionScreen} from './session_screen';

const Stack = createNativeStackNavigator();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RouteParams = {
  Home: undefined;
  Session: {
    session: Session;
  };
  Headless: undefined;
};

const baseOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#ed6a5e',
  },
  headerTintColor: '#000000',
};

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={baseOptions} />
        <Stack.Screen name="Session" component={SessionScreen} options={baseOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
App.displayName = 'App';
