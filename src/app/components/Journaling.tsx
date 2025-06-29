"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import { 
  Heart, 
  TrendingUp, 
  Lightbulb,
  Target,
  BookOpen,
  Star,
  Brain
} from "lucide-react";

type JournalEntry = {
  id?: string;
  text: string;
  createdAt: number;
};

const journalPrompts = [
  {
    id: "gratitude",
    title: "Gratitude",
    prompt: "What are three things you're grateful for today?",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    id: "reflection",
    title: "Daily Reflection",
    prompt: "How did today go? What went well and what could have been better?",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "goals",
    title: "Goals & Intentions",
    prompt: "What are your main goals for tomorrow? How do you want to feel?",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: "challenges",
    title: "Challenges & Growth",
    prompt: "What challenges did you face today? How did you handle them?",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: "inspiration",
    title: "Inspiration",
    prompt: "What inspired you today? Any quotes, moments, or people?",
    icon: Lightbulb,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }
];

const categories = [
  "Personal", "Work", "Health", "Relationships", "Spiritual", "Creative", "Learning"
];

export default function Journaling() {
  const { user } = useAuth();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<typeof journalPrompts[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showPrompts, setShowPrompts] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "journalEntries"),
          where("uid", "==", user.uid)
        );
        const snap = await getDocs(q);
        const entriesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
        // Sort by createdAt in descending order (newest first)
        entriesData.sort((a, b) => b.createdAt - a.createdAt);
        setEntries(entriesData);
      } catch (err) {
        console.error("Failed to load entries. Please try again.", err);
      }
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, "journalEntries"), {
        uid: user.uid,
        text: entry,
        createdAt: Date.now(),
      });
      setEntry("");
      toast.success("Entry saved!");
    } catch (err) {
      console.error("Failed to save entry. Please try again.", err);
      toast.error("Failed to save entry.");
    }
  };

  const handleEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleEditSave = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "journalEntries", id), { text: editText });
      setEditingId(null);
      setEditText("");
      toast.success("Entry updated!");
    } catch (err) {
      console.error("Failed to update entry. Please try again.", err);
      toast.error("Failed to update entry.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "journalEntries", id));
      toast.success("Entry deleted!");
    } catch (err) {
      console.error("Failed to delete entry. Please try again.", err);
      toast.error("Failed to delete entry.");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const handlePromptSelect = (prompt: typeof journalPrompts[0]) => {
    setSelectedPrompt(prompt);
    setEntry(prompt.prompt + "\n\n");
    setShowPrompts(false);
  };

  const clearPrompt = () => {
    setSelectedPrompt(null);
    setEntry("");
  };

  if (!user) {
    return <div className="p-4 text-center text-red-600">Please sign in with Google to use the journaling feature.</div>;
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-neutral-900">Journaling</h1>
          <p className="text-gray-600">Reflect on your thoughts, feelings, and experiences with guided prompts.</p>
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
        <h1 className="text-3xl font-bold mb-2 text-neutral-900">Journaling</h1>
        <p className="text-gray-600">Reflect on your thoughts, feelings, and experiences with guided prompts.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Journaling Interface */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>New Entry</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompts(!showPrompts)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showPrompts ? "Hide" : "Show"} Prompts
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Prompts Section */}
              {showPrompts && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Journaling Prompts</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {journalPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        onClick={() => handlePromptSelect(prompt)}
                        className="p-3 rounded-lg border cursor-pointer hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <prompt.icon className={`h-4 w-4 ${prompt.color}`} />
                          <span className="font-medium text-sm">{prompt.title}</span>
                        </div>
                        <p className="text-xs text-gray-600">{prompt.prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Prompt */}
              {selectedPrompt && (
                <div className={`mb-4 p-3 rounded-lg ${selectedPrompt.bgColor} border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <selectedPrompt.icon className={`h-4 w-4 ${selectedPrompt.color}`} />
                      <span className="font-medium text-sm">{selectedPrompt.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearPrompt}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-sm mt-1">{selectedPrompt.prompt}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <Label className="text-sm font-medium">Category (optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="journal-entry" className="text-base font-medium">
                    {selectedPrompt ? "Your Response" : "What's on your mind?"}
                  </Label>
                  <Textarea
                    id="journal-entry"
                    className="min-h-[120px] mt-2"
                    placeholder={selectedPrompt ? "Write your response here..." : "Write your thoughts, feelings, or experiences..."}
                    value={entry}
                    onChange={e => setEntry(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!entry.trim()}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                  {selectedPrompt && (
                    <Button type="button" variant="outline" onClick={clearPrompt}>
                      Clear Prompt
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Your Journal Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-pulse w-8 h-8 rounded-full bg-muted" />
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No entries yet. Start your journaling journey!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map(e => (
                    <div key={e.id} className="bg-muted rounded-lg p-4 shadow-sm border">
                      {editingId === e.id ? (
                        <div className="space-y-3">
                          <Textarea
                            className="min-h-[100px]"
                            value={editText}
                            onChange={ev => setEditText(ev.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => handleEditSave(e.id!)} size="sm">
                              Save
                            </Button>
                            <Button onClick={() => setEditingId(null)} variant="secondary" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-800 whitespace-pre-line mb-3">{e.text}</div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{new Date(e.createdAt).toLocaleString()}</span>
                            <div className="flex gap-2">
                              <Button onClick={() => handleEdit(e.id!, e.text)} variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button onClick={() => setDeleteId(e.id!)} variant="destructive" size="sm">
                                Delete
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Journaling Tips */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Journaling Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Write freely without worrying about grammar or structure</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Be honest with yourself about your feelings</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Focus on the present moment and your current experiences</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Use prompts to spark reflection when you're stuck</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Benefits of Journaling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Reduces stress and anxiety</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Improves self-awareness</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Helps achieve goals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Enhances creativity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold text-red-700">Delete this entry?</div>
            <div className="mb-6 text-gray-700 text-center">This action cannot be undone.</div>
            <div className="flex gap-4">
              <Button
                onClick={() => handleDelete(deleteId)}
                variant="destructive"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setDeleteId(null)}
                variant="secondary"
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 