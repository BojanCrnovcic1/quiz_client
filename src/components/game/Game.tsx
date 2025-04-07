import { useState } from 'react';
import './game.scss';
import FirstGame from './games/firstGame/FirstGame';
import SecondGame from './games/secondGame/SecondGame';
import ThirdGame from './games/thirdGame/ThirdGame';
import FourthGame from './games/fourthGame/FourthGame';
import FifthGame from './games/fifthGame/FifthGame';
import EndScreen from '../endSceen/EndScreen';
import SixthGame from './games/sixthGame/SixthGame';

const Game = () => {
    const [gameIndex, setGameIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);

    const nextGame = (points: any) => {
        const pointsValue = typeof points === "object" ? points.points : points; 
        setScore((prev) => prev + pointsValue);
        setGameIndex((prev) => prev + 1);
    };

    return (
        <div className='game-container'>
            <div className='questions-and-points'>
                <h1>Koliko poznaješ države?</h1>
                <h2>Poeni: {score}</h2>
            </div>
            {gameIndex === 0 && <FirstGame onNext={nextGame} />}
            {gameIndex === 1 && <FirstGame onNext={nextGame} />}
            {gameIndex === 2 && <SecondGame onNext={nextGame} />}
            {gameIndex === 3 && <SecondGame onNext={nextGame} />}
            {gameIndex === 4 && <ThirdGame onNext={nextGame} />}
            {gameIndex === 5 && <ThirdGame onNext={nextGame} />}
            {gameIndex === 6 && <FourthGame onNext={nextGame} />}
            {gameIndex === 7 && <FourthGame onNext={nextGame} />}
            {gameIndex === 8 && <FifthGame onNext={nextGame} />}
            {gameIndex === 9 && <FifthGame onNext={nextGame} />}
            {gameIndex === 10 && <SixthGame onNext={nextGame} />}
            {gameIndex === 11 && <SixthGame onNext={nextGame} />}
            {gameIndex === 12 && <EndScreen totalPoints={score} />}
        </div>
    );
};

export default Game;
