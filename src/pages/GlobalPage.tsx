import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

export default function GlobalPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any | null>(null);

  useEffect(() => {
    async function fetchPage() {
      // @ts-ignore
      const { data } = await supabase.from<any, any>('global_pages').select('*').eq('slug', slug).single();
      setPage(data);
    }
    fetchPage();
  }, [slug]);

  if (!page) return <div className="min-h-screen flex items-center justify-center">Indlæser...</div>;

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        <ReactMarkdown>{page.content_markdown || ''}</ReactMarkdown>
        <div className="flex gap-2 mt-4 flex-wrap">
          {page.image_urls?.map((url: string) => <img key={url} src={url} alt="billede" className="h-32 rounded" />)}
          {page.video_urls?.map((url: string) => <video key={url} src={url} className="h-32 rounded" controls />)}
        </div>
      </Card>
    </div>
  );
}
