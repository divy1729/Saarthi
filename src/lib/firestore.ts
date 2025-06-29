import { db } from './firebase';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';

export async function getRelevantVerses(question: string): Promise<DocumentData[]> {
  // Simple keyword search: split question into words, search tags
  const words = question.toLowerCase().split(/\W+/).filter(Boolean);
  const versesRef = collection(db, 'verses');
  // For demo: search for any tag matching any word in the question
  const q = query(versesRef, where('tags', 'array-contains-any', words.slice(0, 10)));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
} 