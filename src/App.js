import {useCallback, useEffect, useRef, useState} from "react";
import { Divider } from "@mui/material";

import Balance from "./components/Balance";
import CompetitionClock from "./components/CompetitionClock";

import neutral from "./images/neutral.png";
import blue from "./images/blue.png";
import red from "./images/red.png";

import startSound from "./sounds/start.mp3";
import countdownSound from "./sounds/countdown.mp3";
import endGameSound from "./sounds/endgame.mp3";
import finishedSound from "./sounds/finished.mp3";
import countdownTwoSound from "./sounds/321.mp3";

const DEFAULT = {
    autonomous: 5,
    countdown: 8,
    teleop: 5,
    endwait: 3,
    endgame: 10,
    finished: 0
}

const STATES = Object.keys(DEFAULT);

const useAudio = url => {
    const [audio, setAudio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);
    const setSound = (sound) => {
        setPlaying(false);
        setAudio(sound);
    }

    useEffect(() => {
            playing ? audio.play() : audio.pause();
        },
        [playing, audio]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    return [toggle, setSound];
};

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function App() {
    const [timer, setTimer] = useState({ ...DEFAULT });
    const [currentState, setCurrentState] = useState(STATES[0]);

    const [isStarted, setStarted] = useState(false);
    const [isEndStarted, setEndStarted] = useState(false);
    const [isWinnerFinal, setWinnerFinal] = useState(false);

    const [image, setImage] = useState(neutral);
    const [toggle, setAudio] = useAudio(startSound);

    const incrementStage = useCallback(() => {
        const currentIndex = STATES.indexOf(currentState);

        return STATES[currentIndex + 1];
    }, [currentState]);

    const playSound = useCallback((sound) => {
        setAudio(new Audio(sound));
        toggle();
    }, [setAudio, toggle]);

    useEffect(() => {
        const resetTimer = () => {
            setStarted(false);
            setEndStarted(false);
            setWinnerFinal(false);

            setTimer({ ...DEFAULT });
            setCurrentState(STATES[0]);
            setImage(neutral);
            setAudio(new Audio(startSound));
        }

        const eventListener = (event) => {
            const code = event.code;

            if (["w", "a", "s", "d"].includes(event.key)) {
                updateBalance(code);

                if (currentState === "finished") {
                    setWinnerFinal(true);
                }

                return;
            }

            if (code === "KeyR") {
                resetTimer();
            }
            else if (code === "Enter") {
                if (currentState === "finished") {
                    resetTimer();
                }
                else if (currentState === "endwait") {
                    playSound(countdownTwoSound);
                    setTimeout(() => setEndStarted(true), 500);
                }
                else if (!isStarted) {
                    setStarted(true);
                    toggle();
                }
            }
            else if (code === "Space" && (currentState === "teleop" || currentState === "endgame")) {
                event.preventDefault();
                setStarted(!isStarted);
            }
        }

        document.addEventListener("keydown", eventListener);

        return () => {
            document.removeEventListener("keydown", eventListener);
        }
    }, [isStarted, currentState, toggle, setAudio, setTimer, playSound])

    useInterval(() => {
        if (!isStarted) {
            return;
        }

        if (timer[currentState] === 1) {
            const stage = incrementStage();

            setCurrentState(stage);

            if (stage === "finished") {
                setStarted(false);
                setEndStarted(false);

                playSound(finishedSound);
                return;
            }
            else if (stage === "countdown") {
                playSound(countdownSound);
            }
            else if (stage === "endgame") {
                setTimeout(() => playSound(endGameSound), 1000);
            }
        }

        if (currentState === "endwait" && !isEndStarted) {
            return;
        }

        const newTimer = { ...timer };
        newTimer[currentState]--;

        setTimer(newTimer);
        }, 1000);

    const updateBalance = (code) => {
        if (code === "KeyD") {
            setImage(blue);
        }
        else if (code === "KeyA") {
            setImage(red);
        }
        else if (code === "KeyW" || code === "KeyS") {
            setImage(neutral);
        }
    }

    return (
        <div className="App">
            <CompetitionClock
                currentState={currentState}
                image={image}
                timer={timer}
                isWinnerFinal={isWinnerFinal}
            />
            <Divider color="#EEAD1E"></Divider>
            <Balance image={image} />
        </div>
    );
}
