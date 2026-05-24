import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import './ResultScreen.css';
import { getTitleFromScore, getDescriptionFromScore } from '../data';

function ResultScreen({ playerName, strikes, onPlayAgain, showPlayAgain, isMuted, setIsMuted }) {
    const resultCardRef = useRef(null);
    const strikeCount = strikes.filter(Boolean).length;
    const title = getTitleFromScore(strikeCount);
    const description = getDescriptionFromScore(strikeCount);

    const getCharacterImage = (title) => {
        if (title.includes("Newbie")) return "/character-newbie.png";
        if (title.includes("Regular")) return "/character-regular.png";
        if (title.includes("Pro")) return "/character-pro.png";
        return "/character-legend.png";
    };

    const [isSharing, setIsSharing] = useState(false);

    const captureImage = async (element, attempt = 1) => {
        await document.fonts.ready;

        // Wait for images
        const images = Array.from(element.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 2000);
            });
        }));

        await new Promise(resolve => setTimeout(resolve, 300));

        const dataUrl = await toPng(element, {
            quality: 0.9,
            pixelRatio: 1.5,
            cacheBust: attempt > 1, // Only cacheBust on retry
            onClone: (clonedNode) => {
                const footerText = clonedNode.querySelector('.screenshot-footer-text');
                if (footerText) {
                    footerText.style.display = 'block';
                    footerText.style.position = 'absolute';
                    footerText.style.bottom = '50px';
                    footerText.style.left = '0';
                    footerText.style.width = '100%';
                    footerText.style.color = '#ffffff';
                    footerText.style.textAlign = 'center';
                    footerText.style.fontSize = '20px';
                    footerText.style.fontFamily = "'Retrobit', monospace";
                    footerText.style.zIndex = '1000';
                }
            },
            filter: (node) => {
                const isAction = node.classList?.contains('action-section');
                const isMute = node.classList?.contains('mute-button-result');
                return !isAction && !isMute;
            },
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px'
            }
        });

        return dataUrl;
    };

    const handleShare = async () => {
        if (isSharing) return;
        setIsSharing(true);

        // Track share button click
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'share_click' })
        }).catch(err => console.error("Tracking Error:", err));

        if (!resultCardRef.current) {
            setIsSharing(false);
            return;
        }

        try {
            const element = resultCardRef.current;

            // First attempt
            let dataUrl = await captureImage(element, 1);

            // Check if the image is too small (likely missing background images)
            // A proper capture should be at least 50KB for this layout
            const estimatedSize = (dataUrl.length * 3) / 4; // Rough base64 to bytes conversion

            if (estimatedSize < 50000) {
                console.log('First capture seems incomplete, retrying...');
                // Wait a bit and retry
                await new Promise(resolve => setTimeout(resolve, 500));
                dataUrl = await captureImage(element, 2);
            }

            // Convert Data URL to File Object
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'result.png', { type: 'image/png' });

            const shareData = {
                title: 'Community Bingo',
                text: `I scored ${strikeCount}/16 in Community Bingo! Play it and see how much of gated community life you've actually lived. \nClick to play `,
                url: 'https://community-bingo.mygate.com/',
                files: [file],
            };

            // Share API Logic
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Share failed, falling back to download:', error);
                        downloadImage(dataUrl);
                    }
                }
            } else {
                downloadImage(dataUrl);
            }

        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsSharing(false);
        }
    };

    // Helper function to handle the download fallback
    const downloadImage = (url) => {
        const link = document.createElement('a');
        link.download = 'community-bingo-result.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`result-screen ${showPlayAgain ? 'has-play-again' : 'no-play-again'}`} ref={resultCardRef}>
            {/* Main Background */}
            <img src="/background.jpg" alt="" className="absolute-bg" style={{ objectFit: 'cover', zIndex: -5 }} />

            <button
                className="mute-button-result"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? '🔇' : '🔊'}
            </button>

            <div className="result-header">
                <img
                    src="/logo black-09.png"
                    alt="MyGate"
                    className="mygate-logo-small"
                />
                <img
                    src="/Mygate game -13.png"
                    alt="Community Bingo"
                    className="bingo-header-img"
                />
            </div>

            <div className="scoreboard-window">
                {/* Fake Background */}
                <img src="/scoreboard.png" alt="" className="absolute-bg" />

                <div className="character-rank-section">
                    <div className="character-box">
                        <img src={getCharacterImage(title)} alt="Character" className="character-sprite" />
                    </div>

                    <div className="rank-box">
                        <div className="score-counter">{strikeCount}/16</div>
                        <div className="separator-line"></div>
                        <div className="rank-title">{title}</div>
                    </div>
                </div>

                <div className="bottom-phrase">
                    {playerName},  {description}
                </div>
            </div>

            <div className="screenshot-footer-text">
                Play and find out <br /> your score!
            </div>

            <div className="action-section">
                <button className="share-btn" onClick={handleShare}>
                    <img src="/button-box.png" alt="" className="absolute-bg" />
                    <span style={{ position: 'relative', zIndex: 1 }}>Share your score</span>
                </button>
                {showPlayAgain && (
                    <button className="play-again-btn" onClick={onPlayAgain}>
                        <img src="/yellow-tile.png" alt="" className="absolute-bg" />
                        <span style={{ position: 'relative', zIndex: 1 }}>Play Again</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default ResultScreen;