import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useSafePaddings(): ViewStyle {
  const insets = useSafeAreaInsets();
  return {
    paddingTop: insets.top,
    paddingRight: insets.right,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
  };
}
