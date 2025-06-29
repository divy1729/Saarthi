import { NextRequest, NextResponse } from 'next/server';
import { getRelevantVerses } from '@/lib/firestore';
import { callGroqAPI } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    console.log('Received question:', question);
    
    const verses = await getRelevantVerses(question);
    console.log('Found verses:', verses.length);
    
    const answer = await callGroqAPI(question, verses);
    console.log('Final answer to send:', answer);
    
    const response = { answer, verses };
    console.log('Sending response to frontend:', response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in ask-ai route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 