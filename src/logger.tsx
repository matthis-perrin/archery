import crashlytics from '@react-native-firebase/crashlytics';

export function log(msg: string): void {
  crashlytics().log(msg);
}

export function error(err: unknown): void {
  crashlytics().recordError(err instanceof Error ? err : new Error(String(err)));
}
