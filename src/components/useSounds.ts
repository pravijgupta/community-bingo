import { useCallback, useRef } from 'react';

// Sound URLs - using simple beep sounds
const SOUNDS = {
    strike: 'data:audio/wav;base64,UklGRhwGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfgFAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//8AAP//AAAAAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    ping: 'data:audio/wav;base64,UklGRhQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfAEAAD//wAA//8AAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
};

export function useSound() {
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    const playStrikeSound = useCallback(() => {
        try {
            const ctx = initAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, [initAudioContext]);

    const playUnstrikeSound = useCallback(() => {
        try {
            const ctx = initAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(400, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.08);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, [initAudioContext]);

    const playPingSound = useCallback(() => {
        try {
            const ctx = initAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

            gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, [initAudioContext]);

    const playSuccessSound = useCallback(() => {
        try {
            const ctx = initAudioContext();
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

            notes.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

                gainNode.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);

                oscillator.start(ctx.currentTime + i * 0.1);
                oscillator.stop(ctx.currentTime + i * 0.1 + 0.2);
            });
        } catch (e) {
            console.log('Audio not supported');
        }
    }, [initAudioContext]);

    return {
        playStrikeSound,
        playUnstrikeSound,
        playPingSound,
        playSuccessSound,
    };
}
