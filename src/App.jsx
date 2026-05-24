import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import NameInput from './components/NameInput';
import BingoGrid from './components/BingoGrid';
import ResultScreen from './components/ResultScreen';
import { bingoItems, secondaryBingoItems, columnPersonalities, secondaryColumnPersonalities } from './data';

function App() {
    const [screen, setScreen] = useState('landing'); // landing, name, bingo, result
    const [playerName, setPlayerName] = useState('');
    const [strikes, setStrikes] = useState(Array(16).fill(false));
    const [completedColumns, setCompletedColumns] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [currentBingoItems, setCurrentBingoItems] = useState(bingoItems);



    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const widthScale = window.innerWidth / 390;
            const heightScale = window.innerHeight / 780;

            if (window.innerWidth < 768) {
                // Mobile: Fit width (might overflow vertically)
                setScale(widthScale);
            } else {
                // Desktop: Fit inside screen (contain)
                setScale(Math.min(widthScale, heightScale));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ... Play/Finish handlers ...

    const handleStartGame = () => {
        setScreen('name');
    };

    const handleNameSubmit = (name) => {
        setPlayerName(name);
        setScreen('bingo');
    };

    const handleFinish = () => {
        setScreen('result');
    };

    const handlePlayAgain = () => {
        setStrikes(Array(16).fill(false));
        setCompletedColumns([]);
        setScreen('bingo');
        setCurrentBingoItems(prev => prev === bingoItems ? secondaryBingoItems : bingoItems);
    };

    return (
        <div style={{
            width: 390 * scale,
            height: 780 * scale,
            overflow: 'hidden',
            margin: '0 auto' // Center horizontally if wrapper is smaller than screen (desktop)
        }}>
            <div className="app" style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '390px',
                height: '780px'
            }}>
                {screen === 'landing' && <LandingPage onStart={handleStartGame} isMuted={isMuted} setIsMuted={setIsMuted} />}
                {screen === 'name' && <NameInput onSubmit={handleNameSubmit} isMuted={isMuted} setIsMuted={setIsMuted} />}
                {screen === 'bingo' && (
                    <BingoGrid
                        playerName={playerName}
                        strikes={strikes}
                        setStrikes={setStrikes}
                        completedColumns={completedColumns}
                        setCompletedColumns={setCompletedColumns}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        onFinish={handleFinish}
                        bingoItems={currentBingoItems}
                        personalities={currentBingoItems === bingoItems ? columnPersonalities : secondaryColumnPersonalities}
                    />
                )}
                {screen === 'result' && (
                    <ResultScreen
                        playerName={playerName}
                        strikes={strikes}
                        onPlayAgain={handlePlayAgain}
                        showPlayAgain={currentBingoItems === bingoItems}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
