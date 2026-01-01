import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import Button from './Button';

interface VoiceControlsProps {
  onRecordingComplete: () => void; // In real app, passes audio blob
  disabled?: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([10, 15, 10, 20, 10]);

  // Simulate audio visualizer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        const newBars = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 10);
        setVisualizerBars(newBars);
      }, 100);
    } else {
      setVisualizerBars([4, 4, 4, 4, 4]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      onRecordingComplete();
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
       {/* Fake Visualizer */}
      <div className="flex items-center justify-center gap-1 h-8 w-16 bg-slate-100 rounded-lg px-2">
        {visualizerBars.map((height, i) => (
          <div
            key={i}
            className={`w-1 bg-slate-900 rounded-full transition-all duration-100 ${isRecording ? 'opacity-100' : 'opacity-20'}`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <Button
        variant={isRecording ? 'danger' : 'outline'}
        size="md"
        onClick={handleToggle}
        disabled={disabled}
        className="w-12 h-10 p-0 flex items-center justify-center"
        title={isRecording ? "Stop Recording" : "Start Voice Input"}
      >
        {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default VoiceControls;