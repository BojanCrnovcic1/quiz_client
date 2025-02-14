import { useEffect, useState } from "react";
import './fifthGame.scss';
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { ApiConfig } from "../../../../config/ApiConfig";

interface FlagOption {
    flagUrl: string;
    isCurrent: boolean;
}

interface CountryFlagsResponse {
    countryId: number;
    countryName: string;
    capital: string;
    flags: FlagOption[]
}

interface FifthGameProps {
    onNext: (points: number) => void;
}

const FifthGame = ({ onNext }: FifthGameProps) => {
    const [countryName, setCountryName] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [time, setTime] = useState(30);
    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        axios.get(ApiConfig.API_URL + "api/game/random-flags")
            .then((res) => {
                const data: CountryFlagsResponse = res.data;
                setCountryName(data.countryName);
                setOptions(data.flags.map(option => option.flagUrl));
            })
            .catch(console.error);

        const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            onNext(0);
        }
    }, [time]);
    

    const checkAnswer = (flag: string) => {
        axios.post(ApiConfig.API_URL + "api/game/check-flags", {
            userId: userId,
            country: countryName,
            flag
        }).then((res) => onNext(res.data))
          .catch(() => onNext(0));
    };

    return (
        <div className="fifth-game-container">
            <h2>Koja zastava pripada državi {countryName}?</h2>
            {options.map((flag) => (
                <div className="flags-container" key={flag}>
                    <img 
                    key={flag} 
                    src={ApiConfig.PHOTO_PATH + flag} 
                    alt="Flag" 
                    onClick={() => checkAnswer(flag)} 
                    />
                </div>
            ))}
            <p>Vrijeme: {time}s</p>
        </div>
    );
};

export default FifthGame;
