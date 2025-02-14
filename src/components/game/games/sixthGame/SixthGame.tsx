import { useEffect, useState } from 'react';
import './sixthGame.scss';
import { Country } from '../../../../types/Country';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import { ApiConfig } from '../../../../config/ApiConfig';

interface SixthGameProps {
    onNext: (points: number) => void;
}

const SixthGame = ({ onNext }: SixthGameProps) => {
    const [countries, setCountries] = useState<Country[] | null>(null);
    const [time, setTime] = useState<number>(30);
    const { user } = useAuth();
    const userId = user?.userId;
    const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);

    useEffect(() => {
        fetchRandomCountries();
        const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            handleAnswerSubmit(null); 
        }
    }, [time]);

    const fetchRandomCountries = async () => {
        try {
            const res = await axios.get(ApiConfig.API_URL + 'api/game/random-population');
            setCountries(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnswerSubmit = async (selectedCountry: number | null) => {
        if (!selectedCountry) {
            onNext(-2);
            return;
        }

        try {
            const res = await axios.post(ApiConfig.API_URL + 'api/game/check-population', {
                userId,
                countryId: selectedCountry,
                question: { populations: countries }
            });

            setAnswerResult(res.data > 0 ? 'correct' : 'incorrect');
            
            setTimeout(() => {
                onNext(res.data);
            }, 1000); 
        } catch (error) {
            console.error("Error submitting answer:", error);
            onNext(-2);
        }
    };

    return (
        <div className='sixth-game-container'>
            <h2>Koja država ima veću populaciju?</h2>
            {countries && countries.length === 2 ? (
                <div className="country-buttons">
                    <button
                        className={answerResult === 'correct' && countries[0].countryId ? 'correct' : answerResult === 'incorrect' && countries[0].countryId ? 'incorrect' : ''}
                        onClick={() => countries[0].countryId && handleAnswerSubmit(countries[0].countryId)}
                    >
                        {countries[0].name}
                    </button>
                    <button
                        className={answerResult === 'correct' && countries[1].countryId ? 'correct' : answerResult === 'incorrect' && countries[1].countryId ? 'incorrect' : ''}
                        onClick={() => countries[1].countryId && handleAnswerSubmit(countries[1].countryId)}
                    >
                        {countries[1].name}
                    </button>
                </div>
            ) : (
                <p>Učitavanje država...</p>
            )}
            <p>Vrijeme: {time}s</p>
        </div>
    );
};

export default SixthGame;
