import { useSessionStorage } from '../hooks/useSessionStorage';

export default function Footer() {
    const userData = useSessionStorage('user_data');
    const token = useSessionStorage('auth_token');

    const isLoggedIn = !!token && !!userData;

    const getUserName = () => {
        if (!userData) return 'Korisnik';
            return userData.email;
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    {isLoggedIn ? (
                        <span>Prijavljeni ste kao: <strong>{getUserName()}</strong></span>
                    ) : (
                        <span>Igrate kao gost</span>
                    )}
                </p>
                <p className="footer-copyright">copyright 2025 Kviz Master</p>
            </div>
        </footer>
    );
}