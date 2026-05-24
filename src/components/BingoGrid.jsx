import { useState, useEffect } from 'react';
import './BingoGrid.css';
import { columns } from '../data';
import { useSound } from './useSounds';
import { BingoTile } from './BingoTile';

function BingoGrid({
    playerName,
    strikes,
    setStrikes,
    completedColumns,
    setCompletedColumns,
    isMuted,
    setIsMuted,
    onFinish,
    bingoItems,
    personalities
}) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showGlitter, setShowGlitter] = useState(false);
    const [showFinish, setShowFinish] = useState(false);

    // Removed auto-hide timer for instructions
    // Instructions will now hide on first interaction
    useEffect(() => {
        // No-op
    }, []);

    const { playSuccessSound } = useSound();

    // Check for completed columns
    useEffect(() => {
        Object.entries(columns).forEach(([columnName, indices]) => {
            const isComplete = indices.every(index => strikes[index]);

            if (isComplete && !completedColumns.includes(columnName)) {
                // Column just completed
                setCompletedColumns([...completedColumns, columnName]);

                // Show personality popup
                const message = personalities[columnName];
                setPopupMessage(message);
                setShowPopup(true);

                // Play column complete sound
                if (!isMuted) {
                    playSuccessSound();
                }

                // Show glitter animation
                setShowGlitter(true);
                setTimeout(() => setShowGlitter(false), 2000);

                // Hide popup after 3 seconds
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }
        });
    }, [strikes, completedColumns, playerName, isMuted, setCompletedColumns, playSuccessSound]);

    const handleTileClick = (index) => {
        const newStrikes = [...strikes];
        const wasStruck = newStrikes[index];
        newStrikes[index] = !newStrikes[index];
        setStrikes(newStrikes);

        // Hide instructions and show finish button on first interaction
        if (!showFinish) {
            setShowFinish(true);
        }

        // Play appropriate sound based on strike/unstrike
        if (!isMuted) {
            if (!wasStruck) {
                // Striking - play strike sound
                playStrikeSound();

                // Show confetti animation
                setConfettiTileIndex(index);
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    setConfettiTileIndex(null);
                }, 600);
            } else {
                // Unstriking - play unstrike sound
                playUnstrikeSound();
            }
        } else {
            // Still show confetti even when muted
            if (!wasStruck) {
                setConfettiTileIndex(index);
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    setConfettiTileIndex(null);
                }, 600);
            }
        }
    };



    // Generate glitter particles
    const renderGlitter = () => {
        if (!showGlitter) return null;

        const particles = [];
        for (let i = 0; i < 30; i++) {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            particles.push(
                <div
                    key={i}
                    className="glitter-particle"
                    style={{
                        left: `${left}%`,
                        top: '50%',
                        animationDelay: `${delay}s`,
                        background: ['gold', '#FFD700', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 4)]
                    }}
                />
            );
        }
        return <div className="glitter-container">{particles}</div>;
    };

    return (
        <div className="bingo-grid-page">
            {/* Header */}
            <div className="bingo-header-small">
                <img src="/logo black-09.png" alt="10th Anniversary" className="anniversary-badge" />
                <img src="/Mygate game -13.png" alt="Community Bingo" className="main-header-logo" />
            </div>

            {/* Mute button */}
            <button
                className="mute-button"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>

            {/* Grid */}
            <div className="bingo-grid">
                {bingoItems.map((item, index) => (
                    <BingoTile
                        key={index}
                        text={item}
                        isStruck={strikes[index]}
                        onClick={() => handleTileClick(index)}
                        index={index}
                        isMuted={isMuted}
                    />
                ))}
            </div>

            {/* Instruction text */}
            {/* Instruction text shown for first 3s */}
            {!showFinish && (
                <div className="instruction-text" style={{ textAlign: 'left', width: '85%', margin: '5px auto 10px auto', fontSize: '1.06rem', fontWeight: 'bold' }}>
                    <p style={{ margin: '0 0 5px 0' }}>How to play:</p>
                    <ul style={{ paddingLeft: '20px', margin: '0' }}>
                        <li>Select all boxes that apply to you.</li>
                        <li>Complete a column to unlock a streak.</li>
                        <li>Tap “Finish” once you’re done to get your score.</li>
                    </ul>
                </div>
            )}

            {/* Finish button shown after 3s */}
            {showFinish && (
                <button
                    className="finish-btn"
                    onClick={onFinish}
                >
                    Finish
                </button>
            )}

            {/* Glitter particles for column completion */}
            {renderGlitter()}

            {/* Personality popup */}
            {showPopup && (
                <div className="personality-popup">
                    <div className="popup-banner">
                        <img src="/blue-tile.png" alt="" className="banner-bg" />
                        <p className="popup-text">{popupMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BingoGrid;
