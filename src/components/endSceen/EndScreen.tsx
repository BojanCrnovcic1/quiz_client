import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./endScreen.scss";

interface EndScreenProps {
    totalPoints: number;
}

const EndScreen = ({ totalPoints }: EndScreenProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login");
        }, 60000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleLeaderboardClick = () => {
        localStorage.removeItem("token"); 
        navigate("/leaderboard");
    };

    return (
        <div className="end-screen-container">
            <h1>🎉 Hvala na igranju! 🎉</h1>
            <h2>Osvojili ste {totalPoints} bod!</h2>
            <button onClick={handleLeaderboardClick} style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}>
                Pogledaj rang listu
            </button>
            <p>Bićete automatski odjavljeni za 60 sekundi...</p>
        </div>
    );
};

export default EndScreen;

