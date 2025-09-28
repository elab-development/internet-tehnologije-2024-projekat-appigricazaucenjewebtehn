import React, { useState, useEffect } from 'react';
import './TopTenPlayers.css';


const TopTenPlayers = ()=>{
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTopPlayers();
    }, []);

    const fetchTopPlayers = async () => {
        try {
            const token = window.sessionStorage.getItem('auth_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            setLoading(true);
            const response = await fetch('http://localhost:8000/api/v1/games/top-scores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
      
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            setPlayers(data);
            setError(null);
        } catch (err) {
            setError('Greska pri ucitavanju podataka: ' + err.message);
            console.error('Error fetching top players:', err);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('sr-RS');
    };

    const getGameStatus = (completed) => {
        return completed ? 'Zavrsio' : 'Nije zavrsio';
    };

    const getStatusColor = (completed) => {
        return completed ? '#5ba77bff' : 'rgba(207, 109, 91, 1)';
    };

    if (loading) {
        return (
            <div className="top-ten-container">
                <div className="loading-spinner">Ucitavanje...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchTopPlayers} className="retry-btn">Pokusaj ponovo</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="top-ten-header">
                <h1>Najbolji igraci</h1>
                <p>svih vremena</p>
            </div>

            <div className="table-container">
                <table className="players-table">
                    <thead>
                        <tr>
                            <th className="rank-header">Rang</th>
                            <th className="name-header">Ime</th>
                            <th className="score-header">Rezultat</th>
                            <th className="status-header">Status</th>
                            <th className="date-header">Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.length > 0 ? (
                            players.map((player, index) => (
                            <tr key={player.id} className={index < 3 ? `top-${index + 1}` : ''}>
                            <td className="rank-cell">
                                <span className={'rank-number'}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="name-cell">
                                <span className="player-name">{player.player_name || 'Anoniman igrac'}</span>
                            </td>
                            <td className="score-cell">
                                <span className="score-value">{player.score || 0}</span>
                                <span className="score-label"> poena</span>
                            </td>
                            <td className="status-cell">
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(player.completed) }}
                                >
                                {getGameStatus(player.completed)}
                                </span>
                            </td>
                            <td className="date-cell">{formatDate(player.created_at)}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    Nema podataka o igracima
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <button onClick={fetchTopPlayers} className="refresh-btn">
                Osvezi
                </button>
            </div>
        </div>
    );
};

export default TopTenPlayers;

