import { useEffect, useState } from 'react';
import { Score } from '../../types/Score';
import './leaderboard.scss';
import axios from 'axios';
import { ApiConfig } from '../../config/ApiConfig';

import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { defaultAvatar } from '../../config/defultAvatar';

const Leaderboard = () => {
    const [players, setPlayers] = useState<Score[]>([]);
    const [visiblePlayers, setVisiblePlayers] = useState<Score[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const pageSize = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlayerScore();
    }, []);

    const fetchPlayerScore = async () => {
        try {
            const response = await axios.get(`${ApiConfig.API_URL}api/game/score-list?page=${page}&size=${pageSize}`);
            const sortedPlayers = response.data.sort((a: Score, b: Score) => b.totalScore - a.totalScore);
            setPlayers(sortedPlayers);
            setVisiblePlayers(sortedPlayers.slice(0, pageSize));
        } catch {
            setError("Nešto je pošlo po zlu. Pokušajte ponovo.");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate('/');
    }

    const loadMore = () => {
        if (visiblePlayers.length >= players.length) return;
        const nextPage = page + 1;
        setVisiblePlayers(players.slice(0, (nextPage + 1) * pageSize));
        setPage(nextPage);
    };

    return (
        <div className='leaderboard'>
            <div className="leaderboard-container">
                <h1>🏆 Tabela 🏆</h1>
                {loading && <p>Učitavanje...</p>}
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={fetchPlayerScore}>Pokušaj ponovo</button>
                    </div>
                )}

                <ul className="leaderboard-list">
                    {visiblePlayers.map((player, index) => (
                        <li key={player.scoreId} className={`rank-${index + 1}`}>
                            <span className="rank">#{index + 1}</span>
                            <img 
                                src={player.user?.profilePictureUrl
                                    ? ApiConfig.PHOTO_PATH + player.user?.profilePictureUrl
                                    : defaultAvatar
                                }
                                alt={player.user?.username} 
                                className="profile-pic"
                            />
                            <span className="username">{player.user?.username}</span>
                            <span className="score">{player.totalScore} pts</span>
                        </li>
                    ))}
                </ul>

                {visiblePlayers.length < players.length && (
                    <button className="load-more" onClick={loadMore}>Prikaži još</button>
                )}
            </div>
            <div className='back'>
                <IoArrowBackCircleSharp  onClick={goBack}/>
            </div>
        </div>
    );
};

export default Leaderboard;
