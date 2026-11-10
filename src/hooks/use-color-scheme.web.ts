import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * A subscribe function for a value that never changes after hydration.
 * @returns A no-op unsubscribe function.
 */
function subscribe() {
  return () => {};
}

/**
 * Returns the device's color scheme on web. During static rendering and the
 * first client render it returns 'light' so the server and client HTML match;
 * after hydration it returns the real scheme.
 * @returns 'light', 'dark', or null/undefined if the browser doesn't report one.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
