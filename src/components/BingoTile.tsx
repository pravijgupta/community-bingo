import { useSound } from './useSounds';

interface BingoTileProps {
    text: string;
    isStruck: boolean;
    onClick: () => void;
    index: number;
    isMuted: boolean;
}

export function BingoTile({ text, isStruck, onClick, index, isMuted }: BingoTileProps) {
    const { playStrikeSound, playUnstrikeSound } = useSound();

    const handleClick = () => {
        if (!isMuted) {
            if (isStruck) {
                playUnstrikeSound();
            } else {
                playStrikeSound();
            }
        }
        onClick();
    };

    return (
        <div
            onClick={handleClick}
            className="bingo-tile"
            style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                overflow: 'visible',
                boxSizing: 'border-box',
            }}
        >
            <img
                src={isStruck ? "selected tile.png" : "unselected tile.png"}
                alt="Tile"
                style={{
                    position: 'absolute',
                    top: isStruck ? 'calc(50% + 4px)' : '50%',
                    left: '45%',
                    transform: 'translate(-50%, -50%)',
                    width: '155%',
                    height: '155%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                }}
            />
            <span
                className="tile-text"
                style={{
                    fontSize: '8px',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    fontWeight: 'bold',
                    color: '#333',
                    lineHeight: 1.15,
                    zIndex: 1,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(49% + 9px)',
                    transform: 'translate(-50%, -50%)',
                    padding: '4px',
                    width: '75%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {text}
            </span>
        </div>
    );
}
