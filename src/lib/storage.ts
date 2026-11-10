import AsyncStorage from '@react-native-async-storage/async-storage';

/** One thing the user wants to buy. */
export type ShoppingItem = {
  id: string;
  name: string;
};

/** A store the app can compare prices at. Disabled stores are skipped. */
export type Store = {
  id: string;
  name: string;
  enabled: boolean;
};

const SHOPPING_LIST_KEY = 'price-checker:shopping-list';
const STORES_KEY = 'price-checker:stores';

/** The store list used until the user saves their own choices. */
export const DEFAULT_STORES: Store[] = [
  { id: 'walmart', name: 'Walmart', enabled: true },
  { id: 'target', name: 'Target', enabled: true },
  { id: 'costco', name: 'Costco (manual entry)', enabled: true },
  { id: 'giant-eagle', name: 'Giant Eagle', enabled: false },
];

/**
 * Reads a JSON value from AsyncStorage.
 * @param key The storage key to read.
 * @param fallback What to return when nothing is saved yet or the saved data can't be read.
 * @returns The parsed value, or the fallback.
 */
async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Could not load "${key}" from storage`, error);
    return fallback;
  }
}

/**
 * Writes a value to AsyncStorage as JSON. Failures are logged rather than thrown,
 * so a storage problem never crashes the screen that triggered the save.
 * @param key The storage key to write.
 * @param value The value to save; it must be JSON-serializable.
 */
async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save "${key}" to storage`, error);
  }
}

/**
 * Loads the saved shopping list.
 * @returns The saved items in the order they were added, or an empty list on first run.
 */
export function loadShoppingList(): Promise<ShoppingItem[]> {
  return loadJson<ShoppingItem[]>(SHOPPING_LIST_KEY, []);
}

/**
 * Saves the whole shopping list, replacing what was stored before.
 * @param items The complete list to keep.
 */
export function saveShoppingList(items: ShoppingItem[]): Promise<void> {
  return saveJson(SHOPPING_LIST_KEY, items);
}

/**
 * Loads the saved stores and their on/off settings.
 * @returns The saved stores, or the default stores if the user hasn't changed any yet.
 */
export function loadStores(): Promise<Store[]> {
  return loadJson<Store[]>(STORES_KEY, DEFAULT_STORES);
}

/**
 * Saves the whole store list, replacing what was stored before.
 * @param stores The complete list of stores with their current on/off settings.
 */
export function saveStores(stores: Store[]): Promise<void> {
  return saveJson(STORES_KEY, stores);
}
