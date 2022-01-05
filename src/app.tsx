import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {HomeScreen} from './home_screen';
import {SessionId} from './models';
import {SessionScreen} from './session_screen';
import {SettingsScreen} from './settings_screen';

const Stack = createNativeStackNavigator();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RouteParams = {
  Home: undefined;
  Session: {
    sessionId: SessionId;
  };
  Settings: undefined;
  Headless: undefined;
};

const baseOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
            <Stack.Screen name="Home" component={HomeScreen} options={{...baseOptions}} />
            <Stack.Screen name="Session" component={SessionScreen} options={{...baseOptions}} />
          </Stack.Group>
          <Stack.Group screenOptions={{animation: 'slide_from_left', presentation: 'modal'}}>
            <Stack.Screen name="Settings" component={SettingsScreen} options={{...baseOptions}} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
App.displayName = 'App';
