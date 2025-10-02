import React, { useState, useEffect } from 'react';
import './AdminPlayers.css';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useNavigate } from 'react-router-dom';

export default function AdminPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const [showForm, setShowForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const token = useSessionStorage('auth_token');
    const userData = useSessionStorage('user_data');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || userData.role !== 'admin') {
            setError('Samo administratori mogu pristupiti ovoj stranici.');
            setLoading(false);
        }
    }, [userData]);

    const fetchPlayers = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/admin/players?page=${page}&per_page=${itemsPerPage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.data) {
                setPlayers(data.data);
                setTotalItems(data.total || data.data.length);
                setTotalPages(data.last_page || Math.ceil((data.total || data.data.length) / itemsPerPage));
            } else {
                setPlayers(data);
                setTotalItems(data.length);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching players:', error);
            setError('Greska pri ucitavanju korisnika.');
        } finally {
            setLoading(false);
        }
    };

   useEffect(() => {
        if (userData && userData.role === 'admin' && token) {
            fetchPlayers(currentPage);
        }
    }, [userData, token, currentPage]);

    const handleCreatePlayer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/players', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSuccessMessage('Uspesno sacuvan korisnik!');
            setShowForm(false);
            resetForm();
            fetchPlayers(currentPage);
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Error creating player:', error);
            setError('Greska nije moguce sacuvati korisnika.');
        }
    };

    const handleUpdatePlayer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/players/${editingPlayer.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSuccessMessage('Korisnik uspesno azuriran!');
            setShowForm(false);
            resetForm();
             fetchPlayers(currentPage);
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Error updating player:', error);
            setError('Greska pri azuriranju korisnika.');
        }
    };

    const handleDeletePlayer = async (playerId) => {
        if (!window.confirm('Da li ste sigurni da zelite da obrisete ovog korisnika?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/players/${playerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSuccessMessage('Korisnik uspesno obrisan!');
            fetchPlayers(currentPage);
            
            setTimeout(() => setSuccessMessage(''), 3000);
            
        } catch (error) {
            console.error('Error deleting player:', error);
            setError('Greska pri brisanju korisnika.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user'
        });
        setEditingPlayer(null);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (userData && userData.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <h2>Pristup odbijen</h2>
                <p>Samo administratori mogu pristupiti ovoj stranici.</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Vrati se na pocetnu strnu
                </button>
            </div>
        );
    }

    if (loading) return <div className="loading">Ucitavanje podataka...</div>;
    if (error && !userData) return <div className="error">{error}</div>;

    return (
        <div className="admin-players-container">
            <div className="admin-header">
                <h1>Upravljanje korisnicima</h1>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        resetForm();
                    }} 
                    className="btn-primary"
                >
                    {showForm ? 'Otkazi' : 'Kreiraj novog korisnika'}
                </button>
            </div>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="player-form">
                    <h2>{editingPlayer ? 'Izmeni korisnika' : 'Kreiraj novog korisnika'}</h2>
                    <form onSubmit={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}>
                        <div className="form-group">
                            <label>Ime:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Lozinka:</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required={!editingPlayer}
                                placeholder={editingPlayer ? "Ostavi prazno za ne menjanje" : ""}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Uloga:</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="user">User</option>
                                <option value="premium">Premium</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingPlayer ? 'Sacuvaj izmene' : 'Kreiraj korisnika'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="btn-secondary"
                            >
                                Otkazi
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="players-table">
                <h2>Lista korisnika</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ime</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id}>
                                <td>{player.id}</td>
                                <td>{player.name}</td>
                                <td>{player.email}</td>
                                <td>
                                    <span className={`role-badge role-${player.role}`}>
                                        {player.role}
                                    </span>
                                </td>
                                <td className="actions">
                                    <button 
                                        onClick={() => {
                                            setEditingPlayer(player);
                                            setFormData({
                                                name: player.name,
                                                email: player.email,
                                                password: '',
                                                role: player.role
                                            });
                                            setShowForm(true);
                                        }}
                                        className="btn-edit"
                                    >
                                        Izmeni
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePlayer(player.id)}
                                        className="btn-delete"
                                        disabled={player.id === userData?.id}
                                    >
                                        Obrisi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(totalPages > 1 || players.length > 0) && (
                    <div className="pagination">
                        <button 
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Prethodna
                        </button>
        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        >
                        {page}
                        </button>
                        ))}
        
                        <button 
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Sledeca
                        </button>
                    </div>
                )}

                <div className="pagination-info">
                    Strana {currentPage} od {totalPages} - 
                    Prikazano {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} od {totalItems} korisnika
                </div>
            </div>
        </div>
    );
}