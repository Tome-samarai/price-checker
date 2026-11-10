import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { loadStores, saveStores, type Store } from '@/lib/storage';

/**
 * The Stores tab: lists each store with an on/off switch. Changes are saved
 * on the device straight away.
 * @returns The store settings screen.
 */
export default function StoresScreen() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    loadStores().then(setStores);
  }, []);

  /**
   * Turns one store on or off and saves the updated list.
   * @param id The id of the store to change.
   * @param enabled Whether the store should be included in price checks.
   */
  function handleToggle(id: string, enabled: boolean) {
    const next = stores.map((store) => {
      if (store.id !== id) {
        return store;
      }

      return { ...store, enabled };
    });

    setStores(next);
    saveStores(next);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ThemedText type="subtitle">Stores</ThemedText>

        <FlatList
          data={stores}
          keyExtractor={(store) => store.id}
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.storeRow}>
              <ThemedText style={styles.storeName}>{item.name}</ThemedText>
              <Switch
                value={item.enabled}
                onValueChange={(enabled) => handleToggle(item.id, enabled)}
              />
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: Spacing.two,
  },
  storeName: {
    flex: 1,
  },
});
