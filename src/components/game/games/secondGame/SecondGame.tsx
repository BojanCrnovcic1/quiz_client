import { useEffect, useState } from "react";
import axios from "axios";
import { ApiConfig } from "../../../../config/ApiConfig";
import { useAuth } from "../../../../context/AuthContext";
import "./secondGame.scss";

interface SecondGameProps {
    onNext: (points: number) => void;
}

const SecondGame = ({ onNext }: SecondGameProps) => {
    const [country, setCountry] = useState<string>("");
    const [time, setTime] = useState<number>(30);
    const continents = ["Afrika", "Azija", "Evropa", "Sjeverna Amerika", "Južna Amerika", "Okeanija"];
    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        randomContinentCountry();
        const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            onNext(-2);
        }
    }, [time]);
    
    const randomContinentCountry = async () => {
        try {
            const res = await axios.get(ApiConfig.API_URL + "api/game/random-country-continent");
            setCountry(res.data.name);
        } catch (error) {
            console.error(error);
        }
    };

    const checkAnswer = async (continent: string) => {
        try {
            const res = await axios.post(ApiConfig.API_URL + "api/game/check-continent", {
                userId,
                country,
                continent
            });
            onNext(res.data);
        } catch {
            onNext(-2);
        }
    };

    return (
        <div className="secound-game-container">
            <h2>Na kojem kontinentu se nalazi {country}?</h2>
            <div className="button-container">
                {continents.map((c) => (
                    <button key={c} onClick={() => checkAnswer(c)}>{c}</button>
                ))}
            </div>
            <p>Vrijeme: {time}s</p>
        </div>
    );
};

export default SecondGame;

