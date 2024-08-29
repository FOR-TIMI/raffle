interface AsyncStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  length?: number;
  key?(index: number): Promise<string | null>;
}

const defaultPersistKey = "persist:";

const customStorage: AsyncStorage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(
      sessionStorage.getItem(key.replace(defaultPersistKey, ""))
    );
  },
  setItem: (key: string, value: string): Promise<void> => {
    sessionStorage.setItem(key.replace(defaultPersistKey, ""), value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    sessionStorage.removeItem(key.replace(defaultPersistKey, ""));
    return Promise.resolve();
  },
  clear: (): Promise<void> => {
    sessionStorage.clear();
    return Promise.resolve();
  },
  key: (index: number): Promise<string | null> => {
    return Promise.resolve(sessionStorage.key(index));
  },
};

export default customStorage;
