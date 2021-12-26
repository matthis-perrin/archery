import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';

import {AddSessionButton} from './add_session_button';
import {BackButton} from './back_button';
import {MY_RED} from './colors';
import {HomeScreen} from './home_screen';
import {Session} from './models';
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
    backgroundColor: MY_RED,
  },
  headerTintColor: '#000000',
  headerTitleAlign: 'center',
};

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              ...baseOptions,
              title: 'Accueil',
              headerLeft: SettingsButton,
              headerRight: AddSessionButton,
            }}
          />
          <Stack.Screen
            name="Session"
            component={SessionScreen}
            options={{...baseOptions, title: 'Feuille de score'}}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{animation: 'slide_from_left', presentation: 'modal'}}>
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{...baseOptions, title: 'Réglages', headerLeft: () => BackButton('Close')}}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
App.displayName = 'App';
