"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";
import { 
  Calendar, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Clock, 
  Activity,
  Award,
  BarChart3,
  Smile,
  Frown,
  Meh,
  MessageCircle
} from "lucide-react";
import Image from 'next/image';

type JournalEntry = {
  id?: string;
  text: string;
  createdAt: number;
};

type MoodEntry = {
  id?: string;
  mood: number;
  notes?: string;
  activities?: string[];
  createdAt: Timestamp;
};

type LastAI = {
  question: string;
  answer: string;
  createdAt: number;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [lastAI, setLastAI] = useState<LastAI | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJournalEntries: 0,
    totalMoodEntries: 0,
    averageMood: 0,
    streakDays: 0,
    mostActiveDay: "",
    favoriteActivity: ""
  });
  const [mounted, setMounted] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch recent journal entries
      const journalQuery = query(
        collection(db, "journalEntries"),
        where("uid", "==", user?.uid)
      );
      const journalSnap = await getDocs(journalQuery);
      const journalData = journalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
      // Sort by createdAt in descending order (newest first)
      journalData.sort((a, b) => b.createdAt - a.createdAt);
      setEntries(journalData.slice(0, 3));

      // Fetch mood entries
      const moodQuery = query(
        collection(db, "moodEntries"),
        where("uid", "==", user?.uid)
      );
      const moodSnap = await getDocs(moodQuery);
      const moodData = moodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodEntry));
      // Sort by createdAt in descending order (newest first)
      moodData.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
      setMoodEntries(moodData);

      // Calculate statistics
      calculateStats(journalData, moodData);

      // Fetch last AI question (placeholder for now)
      setLastAI(null);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, fetchData]);

  const calculateStats = (journalData: JournalEntry[], moodData: MoodEntry[]) => {
    const totalJournalEntries = journalData.length;
    const totalMoodEntries = moodData.length;
    
    // Calculate average mood
    const totalMood = moodData.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMoodEntries > 0 ? Math.round((totalMood / totalMoodEntries) * 10) / 10 : 0;

    // Calculate streak (consecutive days with entries)
    const today = new Date();
    const dates = [
      ...journalData.map(entry => new Date(entry.createdAt).toDateString()),
      ...moodData.map(entry => entry.createdAt.toDate().toDateString())
    ];
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    let streakDays = 0;
    let currentDate = new Date(today);
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      const diffTime = Math.abs(currentDate.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streakDays++;
        currentDate = entryDate;
      } else {
        break;
      }
    }

    // Most active day
    const dayCounts: { [key: string]: number } = {};
    [
      ...journalData.map(entry => ({ createdAt: entry.createdAt })),
      ...moodData.map(entry => ({ createdAt: entry.createdAt.toDate().getTime() }))
    ].forEach(entry => {
      const day = new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "No data";

    // Favorite activity from mood entries
    const activityCounts: { [key: string]: number } = {};
    moodData.forEach(entry => {
      entry.activities?.forEach(activity => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    });
    const favoriteActivity = Object.entries(activityCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "No data";

    setStats({
      totalJournalEntries,
      totalMoodEntries,
      averageMood,
      streakDays,
      mostActiveDay,
      favoriteActivity
    });
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Smile className="h-4 w-4 text-green-600" />;
    if (mood >= 3) return <Meh className="h-4 w-4 text-yellow-600" />;
    return <Frown className="h-4 w-4 text-red-600" />;
  };

  if (!user) {
    return <div className="p-4 text-center text-red-600">Please sign in to view your profile.</div>;
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-neutral-900">Your Profile</h1>
          <p className="text-gray-600">Track your mental wellness journey and see your progress.</p>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Your Profile</h1>
        <p className="text-gray-600">Track your mental wellness journey and see your progress.</p>
      </div>

      {/* User Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {user.photoURL && (
              <Image src={user.photoURL} alt="Profile" width={64} height={64} className="w-16 h-16 rounded-full border" />
            )}
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-700">{user.displayName || "User"}</div>
              <div className="text-gray-600">{user.email}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalJournalEntries}</div>
                <div className="text-sm text-gray-600">Journal Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalMoodEntries}</div>
                <div className="text-sm text-gray-600">Mood Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageMood}</div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streakDays}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse w-8 h-8 rounded-full bg-muted mx-auto mb-4" />
                  <p className="text-gray-500">Loading your activity...</p>
                </div>
              ) : entries.length === 0 && moodEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity yet. Start your wellness journey!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recent Journal Entries */}
                  {entries.slice(0, 2).map(e => (
                    <div key={e.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-800">Journal Entry</div>
                        <div className="text-sm text-gray-700 mt-1 line-clamp-2">{e.text}</div>
                        <div className="text-xs text-gray-500 mt-2">{new Date(e.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}

                  {/* Recent Mood Entries */}
                  {moodEntries.slice(0, 2).map(e => (
                    <div key={e.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      {getMoodIcon(e.mood)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-green-800">Mood: {e.mood}/5</div>
                        {e.notes && <div className="text-sm text-gray-700 mt-1">{e.notes}</div>}
                        {e.activities && e.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {e.activities.map((activity, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">{e.createdAt.toDate().toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last AI Question */}
          <Card>
            <CardHeader>
              <CardTitle>Last AI Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              {lastAI ? (
                <div className="bg-blue-50 rounded p-3">
                  <div className="font-medium text-blue-700 mb-1">Q: {lastAI.question}</div>
                  <div className="text-gray-800 whitespace-pre-line">{lastAI.answer}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(lastAI.createdAt).toLocaleString()}</div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">No recent AI questions</div>
                  <p className="text-sm">Ask the AI for guidance on life&apos;s challenges</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard">Ask AI</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Your Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most Active Day</span>
                  <span className="font-medium">{stats.mostActiveDay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favorite Activity</span>
                  <span className="font-medium">{stats.favoriteActivity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-medium">{stats.streakDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/dashboard">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask AI for Guidance
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/breathing">
                    <Heart className="h-4 w-4 mr-2" />
                    Start Breathing Exercise
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/journaling">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Write Journal Entry
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/meditation">
                    <Clock className="h-4 w-4 mr-2" />
                    Start Meditation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/mood-tracker">
                    <Activity className="h-4 w-4 mr-2" />
                    Log Your Mood
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 