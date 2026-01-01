
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, MicOff, Loader2 } from 'lucide-react';
import Button from './Button';

interface VoiceControlsProps {
  onRecordingComplete: (text: string) => void;
  disabled?: boolean;
}

// Add type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([15, 20, 15, 25, 15]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-SG'; // Default to Singapore English, can be dynamic based on prop if needed

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onRecordingComplete(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [onRecordingComplete]);

  // Visualizer effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        const newBars = Array.from({ length: 5 }, () => Math.floor(Math.random() * 25) + 10);
        setVisualizerBars(newBars);
      }, 100);
    } else {
      setVisualizerBars([6, 6, 6, 6, 6]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggle = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start recording:", err);
      }
    }
  };

  if (!isSupported) {
    return (
       <div className="flex items-center justify-center w-14 h-14 bg-slate-100 rounded-2xl text-slate-400" title="Voice not supported">
         <MicOff className="w-5 h-5" />
       </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
       {/* Visualizer - Hidden on small mobile to save space if needed, or kept small */}
      <div className="hidden sm:flex items-center justify-center gap-1.5 h-10 w-20 bg-slate-100 rounded-xl px-3 border border-slate-200">
        {visualizerBars.map((height, i) => (
          <div
            key={i}
            className={`w-1.5 bg-slate-800 rounded-full transition-all duration-100 ${isRecording ? 'opacity-100' : 'opacity-20'}`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <Button
        variant={isRecording ? 'danger' : 'outline'}
        size="lg"
        onClick={handleToggle}
        disabled={disabled}
        className={`h-12 w-12 md:h-14 md:w-14 p-0 flex items-center justify-center relative rounded-2xl border-2 transition-all duration-200 ${isRecording ? 'bg-red-500 border-red-500 shadow-lg shadow-red-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        title={isRecording ? "Stop Recording" : "Start Voice Input"}
        type="button" 
      >
        {isRecording ? <Square className="w-5 h-5 md:w-6 md:h-6 fill-white text-white" /> : <Mic className="w-6 h-6 text-slate-600" />}
        {isRecording && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping border-2 border-white" />
        )}
      </Button>
    </div>
  );
};

export default VoiceControls;
