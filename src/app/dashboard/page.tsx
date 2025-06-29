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
      console.log('Frontend received data:', data);
      console.log('Answer type:', typeof data.answer);
      console.log('Answer value:', data.answer);
      setAnswer(data.answer);
      setVerses(data.verses);
      toast.success("AI answered your question!");
    } catch (err) {
      console.error('Frontend error:', err);
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto w-full relative">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Ask the Gita AI</h1>
        <p className="text-gray-600 italic">Seeking wisdom from the ancient scriptures</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Get Life Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAsk} className="flex flex-col gap-4">
            <textarea
              className="border rounded p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
              placeholder="Ask about a tough life situation..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="w-fit">
              {loading ? "Thinking..." : "Ask AI"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {answer && (
        <Card className="mb-8 animate-in fade-in zoom-in duration-500">
          <CardHeader>
            <CardTitle>AI&apos;s Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base whitespace-pre-line mb-4">
              {answer.split('\n').map((line, index) => {
                // Check if line contains a verse reference (e.g., "Verse 3.26", "Verse 2.14")
                const isVerse = /Verse \d+\.\d+/.test(line) || line.includes('"') && line.includes('Verse');
                
                if (isVerse) {
                  return (
                    <div key={index} className="my-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r">
                      <p className="font-serif text-amber-800 italic text-lg leading-relaxed">
                        {line}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                );
              })}
            </div>
            {verses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Quoted Verses:</h3>
                <ul className="list-disc pl-5">
                  {verses.map((v, i) => (
                    <li key={i} className="mb-1">
                      <span className="font-medium">{v.chapter}:{v.verse}</span> - {v.shloka || v.text}
                      <div className="text-sm text-gray-600 italic">{v.meaning_english || v.translation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Floating peacock feather in bottom right */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none select-none opacity-80">
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
    </div>
  );
} 