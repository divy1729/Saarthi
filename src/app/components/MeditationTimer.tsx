"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Music,
  Leaf,
  Waves,
  Moon,
  CloudRain,
  Brain
} from "lucide-react";

const meditationSessions = [
  {
    id: "beginner",
    name: "Beginner's Mind",
    duration: 5,
    description: "Perfect for those new to meditation",
    icon: Leaf,
    color: "bg-green-500"
  },
  {
    id: "focus",
    name: "Focus & Clarity",
    duration: 10,
    description: "Improve concentration and mental clarity",
    icon: Brain,
    color: "bg-blue-500"
  },
  {
    id: "stress",
    name: "Stress Relief",
    duration: 15,
    description: "Release tension and find inner peace",
    icon: Waves,
    color: "bg-purple-500"
  },
  {
    id: "deep",
    name: "Deep Relaxation",
    duration: 20,
    description: "Extended session for profound relaxation",
    icon: Moon,
    color: "bg-indigo-500"
  }
];

const ambientSounds = [
  { id: "krishna", name: "Krishna's Tune", icon: Music },
  { id: "rain", name: "Rain", icon: CloudRain },
  { id: "ocean", name: "Ocean Waves", icon: Waves },
  { id: "white", name: "White Noise", icon: Volume2 },
  { id: "none", name: "None", icon: VolumeX }
];

export default function MeditationTimer() {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [customMinutes, setCustomMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState(ambientSounds[4]); // None by default
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mounted, setMounted] = useState(false);
  const krishnaRef = useRef<HTMLAudioElement | null>(null);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const oceanRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setAudioContext(new (window.AudioContext || 
        // @ts-expect-error WebkitAudioContext is only available in some browsers
        window.webkitAudioContext)());
    }
  }, []);

  const playCompletionSound = React.useCallback(() => {
    if (audioContext && typeof window !== "undefined") {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  }, [audioContext]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (running && secondsLeft === 0) {
      setRunning(false);
      playCompletionSound();
    }
    return () => clearInterval(interval);
  }, [running, secondsLeft, playCompletionSound]);

  useEffect(() => {
    if (!krishnaRef.current) return;
    if (!soundEnabled || !running) {
      krishnaRef.current.pause();
      krishnaRef.current.currentTime = 0;
    } else if (selectedSound.id === "krishna" && krishnaRef.current) {
      krishnaRef.current.currentTime = 0;
      krishnaRef.current.play();
      krishnaRef.current.loop = true;
    }
  }, [soundEnabled, running, selectedSound]);

  useEffect(() => {
    if (!rainRef.current) return;
    if (!soundEnabled || !running) {
      rainRef.current.pause();
      rainRef.current.currentTime = 0;
    } else if (selectedSound.id === "rain" && rainRef.current) {
      rainRef.current.currentTime = 0;
      rainRef.current.play();
      rainRef.current.loop = true;
    }
  }, [soundEnabled, running, selectedSound]);

  useEffect(() => {
    if (!oceanRef.current) return;
    if (!soundEnabled || !running) {
      oceanRef.current.pause();
      oceanRef.current.currentTime = 0;
    } else if (selectedSound.id === "ocean" && oceanRef.current) {
      oceanRef.current.currentTime = 0;
      oceanRef.current.play();
      oceanRef.current.loop = true;
    }
  }, [soundEnabled, running, selectedSound]);

  const start = () => {
    const duration = selectedSession ? selectedSession.duration * 60 : customMinutes * 60;
    setSecondsLeft(duration);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = secondsLeft > 0 ? ((selectedSession ? selectedSession.duration * 60 : customMinutes * 60) - secondsLeft) / (selectedSession ? selectedSession.duration * 60 : customMinutes * 60) * 100 : 0;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-neutral-900">Meditation Timer</h1>
          <p className="text-gray-600">Choose a guided session or set a custom timer for your meditation practice.</p>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Hidden audio elements for ambient sounds */}
      <audio ref={krishnaRef} src={"/krishna's flute.mp3"} preload="auto" />
      <audio ref={rainRef} src={"/rain.mp3"} preload="auto" />
      <audio ref={oceanRef} src={"/ocean.mp3"} preload="auto" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Meditation Timer</h1>
        <p className="text-gray-600">Choose a guided session or set a custom timer for your meditation practice.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Session Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Guided Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meditationSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSession.id === session.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${session.color}`}>
                      <session.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.name}</h3>
                      <p className="text-sm text-gray-600">{session.duration} minutes</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{session.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Custom Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-minutes">Duration (minutes)</Label>
                  <input
                    id="custom-minutes"
                    type="number"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={running}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Total time: {customMinutes} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ambient Sounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ambientSounds.map((sound) => (
                  <div
                    key={sound.id}
                    onClick={() => setSelectedSound(sound)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSound.id === sound.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <sound.icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">{sound.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full"
                >
                  {soundEnabled ? "Disable" : "Enable"} Sounds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timer Display */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedSession ? selectedSession.name : "Custom Session"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-96">
              {/* Timer Circle */}
              <div className="relative mb-8">
                <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold text-gray-800">
                        {formatTime(secondsLeft)}
                      </div>
                      <div className="text-lg text-gray-600 mt-2">
                        {selectedSession ? selectedSession.duration : customMinutes} minutes
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 transition-all duration-1000"
                  style={{ transform: `rotate(${progress * 3.6}deg)` }}
                />
              </div>

              {/* Controls */}
              <div className="flex gap-4 mb-8">
                {!running ? (
                  <Button onClick={start} size="lg" className="px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={stop} size="lg" variant="outline" className="px-8">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button onClick={reset} size="lg" variant="outline">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  {Math.round(progress)}% complete
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center text-gray-600 max-w-md">
                <p className="mb-4">Find a comfortable position and focus on your breath.</p>
                <p className="text-sm">When your mind wanders, gently bring it back to your breath.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 