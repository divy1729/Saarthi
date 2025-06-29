import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Verse {
  chapter: number;
  verse: number;
  shloka?: string;
  text?: string;
  meaning_english?: string;
  translation?: string;
}

export async function getRelevantVerses(question: string): Promise<Verse[]> {
  // Simple keyword search: split question into words, search tags
  const words = question.toLowerCase().split(/\W+/).filter(Boolean);
  const versesRef = collection(db, 'verses');
  // For demo: search for any tag matching any word in the question
  const q = query(versesRef, where('tags', 'array-contains-any', words.slice(0, 10)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Verse);
} 