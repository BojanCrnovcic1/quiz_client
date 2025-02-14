import { useEffect, useState } from "react";
import './firstGame.scss';
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { ApiConfig } from "../../../../config/ApiConfig";

interface FirstGameProps {
    onNext: (points: number) => void;
}

const FirstGame = ({ onNext }: FirstGameProps) => {
    const [letters, setLetters] = useState<string[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [longestWord, setLongestWord] = useState<string | null>(null);
    const [time, setTime] = useState(60);
    const [disabledLetters, setDisabledLetters] = useState<Set<number>>(new Set());
    const { user } = useAuth();
    const userId = user?.userId;

    useEffect(() => {
        axios.get(ApiConfig.API_URL + "api/game/generate-letters", {
            headers: { "Accept": "application/json" }
        })       
        .then((res) => {
            if (typeof res.data === "string") {
                setLetters(res.data.split(""));
            } else if (Array.isArray(res.data)) {
                setLetters(res.data);
            } else {
                console.error("Unexpected response format:", res.data);
            }
        }) 
        .catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); 
    }, []);

    useEffect(() => {
        if (time === 0) {
            handleSubmit();
          /*  setTimeout(() => {
                onNext(0);
            }, 5000); */
        } 
    }, [time]);
    
    const handleLetterClick = (index: number, letter: string) => {
        if (disabledLetters.has(index)) return;
        
        setSelectedLetters((prev) => [...prev, letter]);
        setSelectedIndexes((prev) => [...prev, index]); 
        setDisabledLetters((prev) => new Set(prev).add(index));
    };

    const handleRemoveLastLetter = () => {
        if (selectedLetters.length === 0) return;

        const lastIndex = selectedIndexes[selectedIndexes.length - 1]; 
        setSelectedLetters((prev) => prev.slice(0, -1));
        setSelectedIndexes((prev) => prev.slice(0, -1));

        setDisabledLetters((prev) => {
            const newSet = new Set(prev);
            newSet.delete(lastIndex);
            return newSet;
        });
    };

    const handleSubmit = async () => {
        if (selectedLetters.length === 0) {
            console.error("⚠️ Nema izabranih slova za proveru!");
            onNext(0);
            return;
        }

        const word = selectedLetters.join("");

        try {
            const res = await axios.post(ApiConfig.API_URL + "api/game/check-country", {
                userId: userId,
                selectedLetters: word,
                allGeneratedLetters: letters 
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const points = res.data.points;
            const longestWord = res.data.longestWord || "Nema moguće reči"; 

            setLongestWord(longestWord);

            setTimeout(() => {
                 onNext(points);
            }, 5000);

        } catch (err) {

            setTimeout(() => {
                onNext(0); 
            }, 5000);
        }
    };

    return (
        <div className="first-game-container">
            <h2>Iskoristi slova i napiši ime države:</h2>
            {longestWord && <p className="longest-word">📝 Najduža moguća riječ:  {longestWord}</p>}
            <div className="letters-container">
                {letters.map((letter, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleLetterClick(index, letter)}
                        disabled={disabledLetters.has(index)} 
                    >
                        {letter.toUpperCase()}
                    </button>
                ))}
                <button  className="space-button"
                    onClick={() => handleLetterClick(letters.length, " ")} 
                    disabled={disabledLetters.has(letters.length)} 
                >
                    ␣
                </button>
            </div>
            
            <h3>Izabrana reč: {selectedLetters.join(" ") || "Još niste izabrali slova"}</h3>

            <button 
                onClick={handleRemoveLastLetter} 
                disabled={selectedLetters.length === 0}
            >
                Obriši poslednje slovo
            </button>

            <button className="confirm-button"
                onClick={handleSubmit} 
                disabled={selectedLetters.length === 0}
            >
                Potvrdi
            </button>

            <p>Vrijeme: {time}s</p>

        </div>
    );
};

export default FirstGame;

