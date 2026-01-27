// Supabase Edge Function: ai-generate-global-page-description-google
import { serve } from 'std/server';

serve(async (req) => {
  const { title, slug } = await req.json();
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return new Response('Missing Google AI API key', { status: 500 });
  }

  const prompt = `Skriv en kort, informativ og letforståelig beskrivelse (på dansk) af følgende modul/funktion til en biludlejningsplatform. Brug markdown og nævn konkrete fordele for brugeren.\n\nTitel: ${title}\nSlug: ${slug}`;

  const googleRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!googleRes.ok) {
    return new Response('Google AI API error', { status: 500 });
  }
  const data = await googleRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return new Response(JSON.stringify({ description: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
