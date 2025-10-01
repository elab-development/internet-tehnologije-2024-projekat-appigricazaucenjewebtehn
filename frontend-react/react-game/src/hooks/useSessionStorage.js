import { useState, useEffect } from 'react';

export function useSessionStorage(key) {
    const [value, setValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            if (!item) return null;
            
            try {
                return JSON.parse(item);
            } catch (firstError) {
                try {
                    const cleaned = item.replace(/^"+|"+$/g, '');
                    return JSON.parse(cleaned);
                } catch (secondError) {
                    return item;
                }
            }
        } catch (error) {
            console.error('Error reading sessionStorage:', error);
            return null;
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

                try {
                    setValue(JSON.parse(item));
                } catch (parseError) {
                    try {
                        const cleaned = item.replace(/^"+|"+$/g, '');
                        setValue(JSON.parse(cleaned));
                    } catch (secondError) {
                        setValue(item);
                    }
                }
            } catch (error) {
                console.error('Error parsing sessionStorage:', error);
                setValue(null);
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
    try {
        const userDataToStore = typeof userData === 'string' ?
         userData : JSON.stringify(userData);
        window.sessionStorage.setItem('auth_token', token);
        window.sessionStorage.setItem('user_data', userDataToStore);
        triggerSessionStorageChange();
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
}

export function logoutUser() {
    try {
        window.sessionStorage.removeItem('auth_token');
        window.sessionStorage.removeItem('user_data');
        triggerSessionStorageChange();
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

