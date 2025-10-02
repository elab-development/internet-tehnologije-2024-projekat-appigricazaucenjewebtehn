import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState } from "react";
import { useSessionStorage } from '../hooks/useSessionStorage';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const userData = useSessionStorage('user_data');
    const isAdmin = userData && userData.role === 'admin';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="nav">
            <Link to="/" className="site-title" onClick={closeMenu}>
                Kviz Master
            </Link>

            <button
                className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
                <CustomLink to="/kviz" onClick={closeMenu}>Kviz</CustomLink>
                <CustomLink to="/login" onClick={closeMenu}>Login</CustomLink>
                <CustomLink to="/top-ten-players" onClick={closeMenu}>Najbolji igraci</CustomLink>
                
                {isAdmin && (
                    <CustomLink to="/admin/players" onClick={closeMenu}>
                        Upravljanje korisnicima
                    </CustomLink>
                )}
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, onClick, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} onClick={onClick} {...props}>{children}</Link>
        </li>
    );
}