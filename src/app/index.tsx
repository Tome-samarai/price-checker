import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { loadShoppingList, saveShoppingList, type ShoppingItem } from '@/lib/storage';

/**
 * Makes an id that is unique enough for items on one device's list.
 * @returns A short random string based on the current time.
 */
function createId(): string {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 8);

  return `${timePart}-${randomPart}`;
}

/**
 * The List tab: lets the user add and remove shopping list items, which are
 * saved on the device, and shows a "Refresh prices" button for later use.
 * @returns The shopping list screen.
 */
export default function ListScreen() {
  const theme = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    loadShoppingList().then(setItems);
  }, []);

  /**
   * Adds the typed text as a new item, saves the list and clears the text box.
   * Blank or whitespace-only text is ignored.
   */
  function handleAdd() {
    const name = draft.trim();

    if (name === '') {
      return;
    }

    const next = [...items, { id: createId(), name }];

    setItems(next);
    saveShoppingList(next);
    setDraft('');
  }

  /**
   * Removes one item from the list and saves the result.
   * @param id The id of the item to remove.
   */
  function handleRemove(id: string) {
    const next = items.filter((item) => item.id !== id);

    setItems(next);
    saveShoppingList(next);
  }

  /** Placeholder for fetching prices; it does nothing yet. */
  function handleRefreshPrices() {}

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ThemedText type="subtitle">Shopping list</ThemedText>

        <ThemedView style={styles.addRow}>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.backgroundElement },
            ]}
            placeholder="Add an item"
            placeholderTextColor={theme.textSecondary}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <Pressable style={styles.addButton} onPress={handleAdd}>
            <ThemedText style={styles.buttonText}>Add</ThemedText>
          </Pressable>
        </ThemedView>

        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary">No items yet.</ThemedText>
          }
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.itemRow}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <Pressable onPress={() => handleRemove(item.id)} hitSlop={8}>
                <ThemedText style={styles.removeText}>Remove</ThemedText>
              </Pressable>
            </ThemedView>
          )}
        />

        <Pressable style={styles.refreshButton} onPress={handleRefreshPrices}>
          <ThemedText style={styles.buttonText}>Refresh prices</ThemedText>
        </Pressable>
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
  addRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    fontSize: 16,
  },
  addButton: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: '#3c87f7',
  },
  list: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: Spacing.two,
  },
  itemName: {
    flex: 1,
  },
  removeText: {
    color: '#e5484d',
  },
  refreshButton: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: '#2e9e4f',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 600,
  },
});
