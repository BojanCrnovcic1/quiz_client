import { useNavigate } from 'react-router-dom';
import './home.scss';

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    }

    const handleLeaderboard = () => {
        navigate('/leaderboard')
    }
  return (
    <div className='home-container'>
        <div className='home-image-container'>
            <img src="/assets/naslovna.png" alt="naslovna" />

        </div>
        <div className='home-text'>
            <h1>DRŽAVE KVIZ</h1>
            <p>Koliko poznaješ države? <b/>
            Zabavite se i pokažite znanje. Srećno!
            </p>
        </div>
        <div className='home-buttons'>
            <button className='button-login' onClick={handleLogin}>Prijavi se</button>
            <button className='button-list' onClick={handleLeaderboard}>Rang lista</button>
        </div>
    </div>
  )
}

export default Home;