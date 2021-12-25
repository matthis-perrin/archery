import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import {Button, Text, TouchableOpacity} from 'react-native';

import {BackButton} from './back_button';
import {HomeScreen} from './home_screen';
import {Session} from './models';
import {useNav} from './navigation';
import {SessionScreen} from './session_screen';
import {SettingsButton} from './settings_button';
import {SettingsScreen} from './settings_screen';

const Stack = createNativeStackNavigator();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RouteParams = {
  Home: undefined;
  Session: {
    session: Session;
  };
  Settings: undefined;
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
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{...baseOptions, headerLeft: SettingsButton}}
          />
          <Stack.Screen name="Session" component={SessionScreen} options={baseOptions} />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{...baseOptions, headerLeft: () => BackButton('Close')}}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
App.displayName = 'App';
