"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";

interface Verse {
  chapter: number;
  verse: number;
  shloka?: string;
  text?: string;
  meaning_english?: string;
  translation?: string;
}

export default function Dashboard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    setVerses([]);
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setVerses(data.verses);
      toast.success("AI answered your question!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-blue-50 to-green-100 flex flex-col items-center justify-start font-sans transition-colors duration-500"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <Toaster position="top-right" richColors />
      <div className="flex flex-col items-center mb-8 mt-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight font-serif drop-shadow-sm transition-all duration-500">Ask the Gita AI</h1>
        <p className="text-lg text-blue-700 italic mt-2 font-light">Seeking wisdom from the ancient scriptures</p>
      </div>

      <Card className="mb-8 w-full max-w-2xl shadow-lg bg-white/80 backdrop-blur-md animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-semibold text-xl text-blue-800 tracking-wide font-sans">Get Life Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAsk} className="flex flex-col gap-4">
            <textarea
              className="border rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-base bg-white/80 font-medium transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-gray-400"
              placeholder="Ask about a tough life situation..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
              style={{ fontFamily: 'inherit' }}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-fit px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow-md hover:scale-105 hover:from-blue-600 hover:to-green-500 transition-all duration-300 focus:ring-2 focus:ring-blue-300"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Thinking...
                </span>
              ) : "Ask AI"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {answer && (
        <Card className="mb-8 max-w-2xl w-full animate-fade-in-up shadow-xl bg-white/90 backdrop-blur-md transition-all duration-700">
          <CardHeader>
            <CardTitle className="font-semibold text-lg text-green-800 font-serif">AI's Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base whitespace-pre-line mb-4 font-sans transition-colors duration-500">
              {answer.split('\n').map((line, index) => {
                const isVerse = /Verse \d+\.\d+/.test(line) || (line.includes('"') && line.includes('Verse'));
                if (isVerse) {
                  return (
                    <div key={index} className="my-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r animate-slide-in-left">
                      <p className="font-serif text-amber-800 italic text-lg leading-relaxed">
                        {line}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={index} className="mb-2 transition-all duration-300">
                    {line}
                  </p>
                );
              })}
            </div>
            {verses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-blue-700">Quoted Verses:</h3>
                <ul className="list-disc pl-5">
                  {verses.map((v, i) => (
                    <li key={i} className="mb-1">
                      <span className="font-medium text-blue-900">{v.chapter}:{v.verse}</span> - <span className="font-serif text-blue-800">{v.shloka || v.text}</span>
                      <div className="text-sm text-gray-600 italic">{v.meaning_english || v.translation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Floating peacock feather in bottom right with animation */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none select-none opacity-80 animate-float">
        <Image
          src="/pankht.png"
          alt="Peacock Feather"
          width={90}
          height={180}
          className="drop-shadow-lg"
          style={{ objectFit: "contain", background: "transparent" }}
          priority
        />
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}