
// A simple service to simulate backend persistence using LocalStorage
// This allows data to persist across refreshes, mimicking a real database.

const DB_PREFIX = 'aura_db_v1_';

export const persistence = {
    save: (key: string, data: any) => {
        try {
            localStorage.setItem(`${DB_PREFIX}${key}`, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save to local storage", e);
        }
    },

    load: <T>(key: string, defaultValue: T): T => {
        try {
            const stored = localStorage.getItem(`${DB_PREFIX}${key}`);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.error("Failed to load from local storage", e);
            return defaultValue;
        }
    },

    clear: () => {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(DB_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            window.location.reload();
        } catch (e) {
            console.error("Failed to clear storage", e);
        }
    }
};
