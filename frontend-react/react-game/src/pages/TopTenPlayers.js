import React, { useState, useEffect } from 'react';
import './TopTenPlayers.css';
import { useSessionStorage } from '../hooks/useSessionStorage';


export default function TopTenPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [filters, setFilters] = useState({
        playerName: '',
        minScore: '',
        maxScore: '',
        dateFrom: '',
        dateTo: ''
    });

    const token = useSessionStorage('auth_token');

    const fetchPlayers = async (page = 1, filterParams = {}) => {
        try {
            setLoading(true);
            
            // Kreiraj query string za filtere i paginaciju
            const queryParams = new URLSearchParams({
                page: page,
                per_page: itemsPerPage,
                ...filterParams
            }).toString();

            const response = await fetch(`http://localhost:8000/api/v1/games/top-scores?${queryParams}`, {
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
            
            // Ako backend vraća paginacione podatke
            if (data.data) {
                setPlayers(data.data);
                setTotalItems(data.total || data.data.length);
            } else {
                setPlayers(data);
                setTotalItems(data.length);
            }
            
            setError(null);
        } catch (error) {
            console.error('Error fetching players:', error);
            setError('Došlo je do greške pri učitavanju podataka.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers(currentPage, filters);
    }, [currentPage, itemsPerPage]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = () => {
        setCurrentPage(1); // Vrati na prvu stranu
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        fetchPlayers(1, cleanFilters);
    };

    const resetFilters = () => {
        setFilters({
            playerName: '',
            minScore: '',
            maxScore: '',
            dateFrom: '',
            dateTo: ''
        });
        setCurrentPage(1);
        fetchPlayers(1);
    };

     const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div className="loading">Ucitavanje podataka...</div>;

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="top-players-container">
            <h1>Najbolji Igrači</h1>
            
            {/* Filteri */}
            <div className="filters-section">
                <h3>Filteri</h3>
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Ime igrača:</label>
                        <input
                            type="text"
                            value={filters.playerName}
                            onChange={(e) => handleFilterChange('playerName', e.target.value)}
                            placeholder="Filter po imenu..."
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Min score:</label>
                        <input
                            type="number"
                            value={filters.minScore}
                            onChange={(e) => handleFilterChange('minScore', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Max score:</label>
                        <input
                            type="number"
                            value={filters.maxScore}
                            onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                            placeholder="1000"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Od datuma:</label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Do datuma:</label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="filter-actions">
                    <button onClick={applyFilters} className="btn-primary">
                        Primeni Filtere
                    </button>
                    <button onClick={resetFilters} className="btn-secondary">
                        Resetuj Filtere
                    </button>
                </div>
            </div>

            {/* Tabela sa podacima */}
            <div className="players-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Ime</th>
                            <th>Email</th>
                            <th>Score</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, index) => (
                            <tr key={player.id}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{player.player_name}</td>
                                <td>{player.player_email}</td>
                                <td>{player.score}</td>
                                <td>{new Date(player.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginacija */}
            {totalPages > 1 && (
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
                        Sledeća
                    </button>
                </div>
            )}

            {/* Info o paginaciji */}
            <div className="pagination-info">
                Prikazano {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} od {totalItems} rezultata
            </div>
        </div>
    );
};


