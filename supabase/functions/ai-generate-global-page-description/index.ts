// Supabase Edge Function: ai-generate-global-page-description
import { serve } from 'std/server';

serve(async (req) => {
  const { title, slug } = await req.json();
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return new Response('Missing OpenAI API key', { status: 500 });
  }

  const prompt = `Skriv en kort, informativ og letforståelig beskrivelse (på dansk) af følgende modul/funktion til en biludlejningsplatform. Brug markdown og nævn konkrete fordele for brugeren.\n\nTitel: ${title}\nSlug: ${slug}`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Du er en hjælpsom tekstforfatter for en dansk biludlejningsplatform.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!openaiRes.ok) {
    return new Response('OpenAI API error', { status: 500 });
  }
  const data = await openaiRes.json();
  const text = data.choices?.[0]?.message?.content || '';
  return new Response(JSON.stringify({ description: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
