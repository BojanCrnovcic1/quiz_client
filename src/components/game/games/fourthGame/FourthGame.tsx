import { useEffect, useState } from "react";
import './fourthGame.scss';
import axios from "axios";
import { ApiConfig } from "../../../../config/ApiConfig";
import { useAuth } from "../../../../context/AuthContext";

interface CapitalOption {
    capital: string;
    isCurrent: boolean;
}

interface CountryCapitalResponse {
    countryId: number;
    countryName: string;
    capitals: CapitalOption[];
}

interface FourthGameProps {
    onNext: (points: number) => void;
}

const FourthGame = ({ onNext }: FourthGameProps) => {
    const [countryName, setCountryName] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [time, setTime] = useState(30);
    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        axios.get(ApiConfig.API_URL + "api/game/random-country-capital")
            .then((res) => {
                const data: CountryCapitalResponse = res.data;
                setCountryName(data.countryName);
                setOptions(data.capitals.map(option => option.capital));
            })
            .catch(console.error);

        const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            onNext(-3);
        }
    }, [time]);
    

    const checkAnswer = (capital: string) => {
        axios.post(ApiConfig.API_URL + "api/game/check-capital", {
            userId,
            country: countryName,
            capital
        }).then((res) => onNext(res.data))
          .catch(() => onNext(-3));
    };

    return (
        <div className="fourth-game-container">
            <h2>Koji je glavni grad države: {countryName}?</h2>
            {options.map((capital) => (
              <div className="buttons-container" key={capital}>
                 <button key={capital} onClick={() => checkAnswer(capital)}>
                    {capital}
                </button>
              </div>
            ))}
            <p>Vrijeme: {time}s</p>
        </div>
    );
};

export default FourthGame;