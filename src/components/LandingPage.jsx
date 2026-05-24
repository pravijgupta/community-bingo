import React, { useEffect } from 'react';
import './LandingPage.css';

function LandingPage({ onStart, isMuted, setIsMuted }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onStart();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onStart]);

    return (
        <div className="landing-page">
            {/* Mute button */}
            <button
                className="mute-button-landing"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>

            <div className="landing-content">
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

                <div className="cta-card">
                    <p className="cta-text">How much society life have you really lived?</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
