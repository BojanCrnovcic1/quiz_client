import { useEffect, useState } from "react";
import './thirdGame.scss';
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { ApiConfig } from "../../../../config/ApiConfig";
import { Country } from "../../../../types/Country";

interface ThirdGameProps {
    onNext: (points: number) => void;
}

const ThirdGame = ({ onNext }: ThirdGameProps) => {
    const [country, setCountry] = useState<Country | null>(null);
    const [input, setInput] = useState<string>("");
    const [time, setTime] = useState<number>(30);
    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        axios.get(ApiConfig.API_URL + "api/game/random-flag")
            .then((res) => {
                console.log("Response from API:", res.data); 
                setCountry(res.data);
            })
            .catch((error) => {
                console.error("Error fetching flag:", error);
            });

        const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            onNext(0);
        }
    }, [time]);
    

    const handleSubmit = () => {
        if (!country) {
            console.error("Country is undefined!");
            return;
        }
        if (!input.trim()) {
            console.error("Unos je prazan!");
            return;
        }

        const requestData = {
            userId,
            country: country.name, 
            guess: input            
        };

        console.log("Šaljem podatke:", requestData);

        axios.post(ApiConfig.API_URL + "api/game/check-flag", requestData)
            .then((res) => onNext(res.data))
            .catch((error) => {
                console.error("Greška u API pozivu:", error);
                onNext(0);
            });
    };

    return (
        <div className="third-game-container">
            <h2>Kojoj državi pripada ova zastava?</h2>
            {country ? (
                <>
                    <img 
                        src={`${ApiConfig.PHOTO_PATH}${country.flagUrl}`} 
                        alt={`Flag of ${country.name}`} 
                    />
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Unesite naziv države"
                    />
                    <button onClick={handleSubmit}>Potvrdi</button>
                    <p>Vrijeme: {time}s</p>
                </>
            ) : (
                <p>Učitavanje zastave...</p>
            )}
        </div>
    );
};

export default ThirdGame;

