import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSend: (input: string) => void;
  disabled: boolean;
}

// FIX: Define SpeechRecognition interface to provide types for the Web Speech API.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// FIX: Define the constructor type for SpeechRecognition.
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}


const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    // FIX: Use a type assertion to inform TypeScript about the SpeechRecognition constructor.
    const SpeechRecognition = (window as any).webkitSpeechRecognition as SpeechRecognitionStatic;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      onSend(transcript); // Automatically send after speech is recognized
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [onSend]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleListen = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="bg-black/30 p-4 shrink-0">
      <div className="flex items-center space-x-2 bg-soft-blush/10 rounded-full border border-warm-taupe/50 px-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your sommelier..."
          disabled={disabled}
          className="w-full bg-transparent p-3 text-white placeholder-warm-taupe/70 focus:outline-none"
        />
        <button
          onClick={toggleListen}
          disabled={disabled}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white animate-pulse' : 'text-warm-taupe hover:text-gold-accent'}`}
        >
          <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-gold-accent text-deep-burgundy p-2 rounded-full disabled:bg-warm-taupe/50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
