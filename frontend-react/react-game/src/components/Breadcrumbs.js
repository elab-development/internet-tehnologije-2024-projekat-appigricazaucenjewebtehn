import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs() {
    const location = useLocation();
    
    const pathNames = {
        '': 'Pocetna',
        'kviz': 'Kviz',
        'login': 'Prijava',
        'top-ten-players': 'Najbolji igraci',
        'register': 'Registracija'
    };

    const pathnames = location.pathname.split('/').filter(x => x);

    if (pathnames.length === 0) {
        return null;
    }
    
    return (
        <nav className="breadcrumbs">
            <div className="breadcrumbs-container">
                <Link to="/" className="breadcrumb-item">
                    Pocetna
                </Link>
                
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    
                    return (
                        <span key={to} className="breadcrumb-separator">
                            &gt;
                            {isLast ? (
                                <span className="breadcrumb-current">
                                    {pathNames[value] || value}
                                </span>
                            ) : (
                                <Link to={to} className="breadcrumb-item">
                                    {pathNames[value] || value}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </div>
        </nav>
    );
}