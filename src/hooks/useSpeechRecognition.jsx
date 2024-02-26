import { useEffect, useState } from "react";

let recognition = null;


if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
   
}

export default function useSpeechRecognition() {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            setText(event.results[0][0].transcript);
            recognition.stop();
            setIsListening(false);
        }

        return () => {
            recognition.onresult = null;
        };
    }, []);

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition.start();
    }

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    }

    return {
        text,
        isListening,
        startListening,
        stopListening,
        recognitionSupport:!!recognition
    };
}
