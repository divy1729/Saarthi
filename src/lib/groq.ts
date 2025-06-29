export async function callGroqAPI(question: string, verses: any[]) {
  const prompt = `User question: ${question}\nRelevant Bhagavad Gita verses:\n${verses.map(v => `${v.chapter}:${v.verse} - ${v.text}`).join('\n')}\nPlease answer the user's question, quoting the verses where appropriate.`;
  
  console.log('Sending request to Groq API with prompt:', prompt);
  console.log('Using API key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');
  
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });
  
  const data = await res.json();
  console.log('Groq API response:', JSON.stringify(data, null, 2));
  
  const answer = data.choices?.[0]?.message?.content || '';
  console.log('Extracted answer:', answer);
  
  return answer;
} 