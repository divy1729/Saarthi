"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Brain, 
  Zap,
  Moon,
  Sun
} from "lucide-react";

const breathingTechniques = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, hold - great for stress relief",
    steps: [
      { label: "Breathe In", duration: 4000, color: "bg-blue-500" },
      { label: "Hold", duration: 4000, color: "bg-blue-600" },
      { label: "Breathe Out", duration: 4000, color: "bg-blue-400" },
      { label: "Hold", duration: 4000, color: "bg-blue-300" },
    ],
    icon: Brain,
    benefits: ["Reduces stress", "Improves focus", "Calms nervous system"]
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8 - promotes relaxation",
    steps: [
      { label: "Breathe In", duration: 4000, color: "bg-green-500" },
      { label: "Hold", duration: 7000, color: "bg-green-600" },
      { label: "Breathe Out", duration: 8000, color: "bg-green-400" },
    ],
    icon: Heart,
    benefits: ["Promotes sleep", "Reduces anxiety", "Lowers blood pressure"]
  },
  {
    id: "triangle",
    name: "Triangle Breathing",
    description: "Equal inhale, hold, exhale - simple and effective",
    steps: [
      { label: "Breathe In", duration: 4000, color: "bg-purple-500" },
      { label: "Hold", duration: 4000, color: "bg-purple-600" },
      { label: "Breathe Out", duration: 4000, color: "bg-purple-400" },
    ],
    icon: Zap,
    benefits: ["Balances energy", "Improves concentration", "Reduces tension"]
  },
  {
    id: "relaxing",
    name: "Relaxing Breath",
    description: "Longer exhale than inhale - activates parasympathetic system",
    steps: [
      { label: "Breathe In", duration: 3000, color: "bg-orange-500" },
      { label: "Breathe Out", duration: 6000, color: "bg-orange-400" },
    ],
    icon: Moon,
    benefits: ["Deep relaxation", "Better sleep", "Stress reduction"]
  }
];

export default function BreathingExercise() {
  const [selectedTechnique, setSelectedTechnique] = useState(breathingTechniques[0]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState(selectedTechnique.steps[0].duration / 1000);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t > 1) return t - 1;
          
          // Move to next step
          const nextStep = (step + 1) % selectedTechnique.steps.length;
          setStep(nextStep);
          
          // Count cycles
          if (nextStep === 0) {
            setCycles(c => c + 1);
            if (cycles + 1 >= totalCycles) {
              setRunning(false);
              return 0;
            }
          }
          
          return selectedTechnique.steps[nextStep].duration / 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, step, selectedTechnique, cycles, totalCycles]);

  const start = () => {
    setRunning(true);
    setStep(0);
    setCycles(0);
    setTimer(selectedTechnique.steps[0].duration / 1000);
  };

  const stop = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setStep(0);
    setCycles(0);
    setTimer(selectedTechnique.steps[0].duration / 1000);
  };

  const handleTechniqueChange = (technique: typeof breathingTechniques[0]) => {
    setSelectedTechnique(technique);
    reset();
  };

  const currentStep = selectedTechnique.steps[step];
  const progress = ((selectedTechnique.steps[step].duration / 1000 - timer) / (selectedTechnique.steps[step].duration / 1000)) * 100;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Breathing Exercises</h1>
        <p className="text-gray-600">Choose a breathing technique and follow the guided prompts to relax and center yourself.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Technique Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Choose Technique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {breathingTechniques.map((technique) => (
                <div
                  key={technique.id}
                  onClick={() => handleTechniqueChange(technique)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTechnique.id === technique.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <technique.icon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">{technique.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {technique.benefits.map((benefit, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cycles">Number of Cycles</Label>
                  <input
                    id="cycles"
                    type="number"
                    min="1"
                    max="20"
                    value={totalCycles}
                    onChange={(e) => setTotalCycles(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={running}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Current cycle: {cycles + 1} / {totalCycles}</p>
                  <p>Total time: ~{Math.round((selectedTechnique.steps.reduce((sum, step) => sum + step.duration, 0) * totalCycles) / 1000 / 60)} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breathing Exercise */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{selectedTechnique.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-96">
              {/* Breathing Circle */}
              <div className="relative mb-8">
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div 
                    className={`w-32 h-32 rounded-full ${currentStep.color} transition-all duration-1000 flex items-center justify-center`}
                    style={{
                      transform: `scale(${running ? 1 + (progress / 100) * 0.3 : 1})`,
                    }}
                  >
                    <div className="text-white text-2xl font-bold">{timer}s</div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 transition-all duration-1000"
                     style={{ transform: `rotate(${progress * 3.6}deg)` }} />
              </div>

              {/* Current Step */}
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-800 mb-2">{currentStep.label}</div>
                <div className="text-lg text-gray-600">Step {step + 1} of {selectedTechnique.steps.length}</div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
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

              {/* Instructions */}
              <div className="mt-8 text-center text-gray-600 max-w-md">
                <p className="mb-4">Follow the expanding circle to match your breathing rhythm.</p>
                <p className="text-sm">Find a comfortable position and focus on your breath.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 