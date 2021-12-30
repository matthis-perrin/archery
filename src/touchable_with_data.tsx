import React, {useCallback} from 'react';
import {TouchableWithoutFeedback, TouchableWithoutFeedbackProps} from 'react-native';

export interface TouchableWithDataProps<T> extends Omit<TouchableWithoutFeedbackProps, 'onPress'> {
  data: T;
  onPress: (data: T) => void;
}

// eslint-disable-next-line react/function-component-definition, @typescript-eslint/naming-convention
export function TouchableWithData<T>(props: TouchableWithDataProps<T>): JSX.Element {
  const {data, onPress, children, ...rest} = props;

  const handlePress = useCallback(() => {
    onPress(data);
  }, [data, onPress]);

  return (
    <TouchableWithoutFeedback onPress={handlePress} {...rest}>
      {children}
    </TouchableWithoutFeedback>
  );
}
TouchableWithData.displayName = 'TouchableWithData';
