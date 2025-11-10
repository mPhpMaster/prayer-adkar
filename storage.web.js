/**
 * Web-compatible AsyncStorage implementation using localStorage
 */

const AsyncStorage = {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },

  async clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  async getAllKeys() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      return [];
    }
  },

  async multiGet(keys) {
    try {
      return keys.map(key => [key, localStorage.getItem(key)]);
    } catch (error) {
      console.error('Error getting multiple items from storage:', error);
      return [];
    }
  },

  async multiSet(keyValuePairs) {
    try {
      keyValuePairs.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    } catch (error) {
      console.error('Error setting multiple items in storage:', error);
    }
  },

  async multiRemove(keys) {
    try {
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error removing multiple items from storage:', error);
    }
  },
};

export default AsyncStorage;
