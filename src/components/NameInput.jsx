import { useState } from 'react';
import './NameInput.css';

function NameInput({ onSubmit, isMuted, setIsMuted }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            // Track name submission
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'name_submit' })
            }).catch(err => console.error("Tracking Error:", err));

            onSubmit(name.trim());
        }
    };

    return (
        <div className="name-input-page">
            {/* Mute button */}
            <button
                className="mute-button-name"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>

            <div className="name-input-content">
                <img
                    src="/Copy of 10th year anniversary.png"
                    alt="MyGate 10th Anniversary"
                    className="mygate-logo"
                />

                <img
                    src="/Mygate game -13.png"
                    alt="Community Bingo"
                    className="bingo-header"
                />

                <div className="input-card">
                    <h2>What would you like to be called?</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="name-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            maxLength={20}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!name.trim()}
                        >
                            Play Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NameInput;
