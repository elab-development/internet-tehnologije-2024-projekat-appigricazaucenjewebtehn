import { useState, useEffect } from 'react';

export function useSessionStorage(key) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            if (!item) return null;
            
            if (item.startsWith('"') && item.endsWith('"')) {
                const parsed = JSON.parse(item);
                return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
            }
            
            return JSON.parse(item);
        } catch (error) {
            console.error('Error reading sessionStorage:', error);
            return window.sessionStorage.getItem(key);
        }
    });

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.sessionStorage.getItem(key);
                if (!item) {
                    setValue(null);
                    return;
                }

                if (item.startsWith('"') && item.endsWith('"')) {
                    const parsed = JSON.parse(item);
                    setValue(typeof parsed === 'string' ? JSON.parse(parsed) : parsed);
                } else {
                    setValue(JSON.parse(item));
                }
            } catch (error) {
                console.error('Error parsing sessionStorage:', error);
                setValue(window.sessionStorage.getItem(key));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        window.addEventListener('sessionStorageChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('sessionStorageChanged', handleStorageChange);
        };
    }, [key]);

    return value;
}

export function triggerSessionStorageChange() {
    window.dispatchEvent(new Event('sessionStorageChanged'));
}

export function loginUser(token, userData) {
    window.sessionStorage.setItem('auth_token', token);
    window.sessionStorage.setItem('user_data', JSON.stringify(userData));
    triggerSessionStorageChange();
}

export function logoutUser() {
    window.sessionStorage.removeItem('auth_token');
    window.sessionStorage.removeItem('user_data');
    triggerSessionStorageChange();
}


