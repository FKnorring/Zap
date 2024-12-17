export const getLocalStorageValue = (key: string): number | null => {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return null;
    }
  };
  
  export const setLocalStorageValue = (key: string, value: number): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  export const removeLocalStorageValue = (key: string): boolean => {
    try {
      localStorage.removeItem(key);
        return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  };
  