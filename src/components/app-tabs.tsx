import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * The app's bottom tab bar on iOS and Android, with the List and Stores tabs.
 * @returns The native tab navigator.
 */
export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>List</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stores">
        <NativeTabs.Trigger.Label>Stores</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="storefront" md="storefront" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
