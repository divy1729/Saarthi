"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";

type MoodEntry = {
  id?: string;
  mood: number; // 1-5 scale
  notes?: string;
  activities?: string[];
  createdAt: Timestamp;
};

const moodOptions = [
  { value: 1, label: "Very Low", icon: Frown, color: "text-red-600", bgColor: "bg-red-50" },
  { value: 2, label: "Low", icon: Meh, color: "text-orange-600", bgColor: "bg-orange-50" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-600", bgColor: "bg-yellow-50" },
  { value: 4, label: "Good", icon: Smile, color: "text-green-600", bgColor: "bg-green-50" },
  { value: 5, label: "Excellent", icon: Heart, color: "text-purple-600", bgColor: "bg-purple-50" },
];

const activityOptions = [
  "Exercise", "Meditation", "Reading", "Socializing", "Work", 
  "Sleep", "Eating", "Hobbies", "Nature", "Music"
];

export default function MoodTracker() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState({
    averageMood: 0,
    totalEntries: 0,
    weeklyTrend: [] as number[],
  });
  const [mounted, setMounted] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "moodEntries"),
        where("uid", "==", user?.uid)
      );
      const snap = await getDocs(q);
      const fetchedEntries = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodEntry));
      // Sort by createdAt in descending order (newest first)
      fetchedEntries.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
      setEntries(fetchedEntries);
    } catch (err) {
      toast.error("Failed to load mood entries");
    }
  }, [user]);

  const calculateAnalytics = useCallback(() => {
    const totalMood = entries.reduce((sum, entry) => sum + entry.mood, 0);
    const average = totalMood / entries.length;
    
    // Calculate weekly trend (last 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyEntries = entries.filter(entry => 
      entry.createdAt.toDate() >= weekAgo
    );
    
    const weeklyTrend = weeklyEntries.map(entry => entry.mood);
    
    setAnalytics({
      averageMood: Math.round(average * 10) / 10,
      totalEntries: entries.length,
      weeklyTrend,
    });
  }, [entries]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchEntries();
  }, [user, fetchEntries]);

  useEffect(() => {
    if (entries.length > 0) {
      calculateAnalytics();
    }
  }, [entries, calculateAnalytics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedMood === null) return;

    try {
      await addDoc(collection(db, "moodEntries"), {
        uid: user.uid,
        mood: selectedMood,
        notes: notes.trim() || null,
        activities: selectedActivities,
        createdAt: Timestamp.now(),
      });
      
      toast.success("Mood logged successfully!");
      setSelectedMood(null);
      setNotes("");
      setSelectedActivities([]);
      fetchEntries();
    } catch (err) {
      toast.error("Failed to save mood entry");
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  if (!user) {
    return <div className="p-4 text-center text-red-600">Please sign in to use mood tracking.</div>;
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-neutral-900">Mood Tracker</h1>
          <p className="text-gray-600">Track your daily moods and discover patterns in your emotional well-being.</p>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <Toaster position="top-right" richColors />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Mood Tracker</h1>
        <p className="text-gray-600">Track your daily moods and discover patterns in your emotional well-being.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Logging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Your Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium">How are you feeling today?</Label>
                <div className="grid grid-cols-5 gap-3 mt-3">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? `${option.bgColor} ${option.color} border-current`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option.icon className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">What activities did you do today?</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {activityOptions.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedActivities.includes(activity)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-medium">Additional notes (optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How was your day? Any specific thoughts or feelings?"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                disabled={selectedMood === null}
                className="w-full"
              >
                Log Mood
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Mood Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.averageMood}</div>
                <div className="text-sm text-gray-600">Average Mood</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analytics.totalEntries}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Weekly Trend</Label>
              <div className="flex items-end gap-1 mt-3 h-20">
                {analytics.weeklyTrend.slice(-7).map((mood, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-200 rounded-t"
                    style={{ height: `${(mood / 5) * 100}%` }}
                    title={`Day ${index + 1}: ${mood}/5`}
                  />
                ))}
              </div>
            </div>

            {entries.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No mood entries yet. Start tracking to see your patterns!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${moodOptions[entry.mood - 1].bgColor}`}>
                    {React.createElement(moodOptions[entry.mood - 1].icon, { 
                      className: `h-6 w-6 ${moodOptions[entry.mood - 1].color}` 
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{moodOptions[entry.mood - 1].label}</div>
                    {entry.notes && <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>}
                    {entry.activities && entry.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.activities.map((activity) => (
                          <span key={activity} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {activity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.createdAt.toDate().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 