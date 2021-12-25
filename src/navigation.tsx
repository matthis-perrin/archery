import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RouteParams} from './app';

export function useNav(): NativeStackNavigationProp<RouteParams, 'Headless'> {
  return useNavigation<NativeStackNavigationProp<RouteParams, 'Headless'>>();
}
