'use client';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Quote } from 'lucide-react';

interface EditorialQuoteProps {
  data: {
    title?: string;
    subtitle?: string;
  };
}

export function EditorialQuote({ data: initialData }: EditorialQuoteProps) {
  const { data = initialData } = useQuery({
    queryKey: ['homepage_content', 'editorial_quote'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('section_key', 'editorial_quote')
        .single();
      if (error) throw error;
      return data;
    },
    initialData: initialData
  });

  const quoteText = data?.title || "Style is not a fleeting moment, but a permanent archive of who we are and where we've been.";
  const author = data?.subtitle || "ELITE EDITORIAL, VOL. IV";

  return (
    <section className="py-5 md:py-7 bg-[#F8F8F8] border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="text-[#D97706] mb-6">
          <Quote fill="currentColor" size={32} className="rotate-180" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tighter text-[#1C1C1C] leading-tight italic mb-6 max-w-3xl">
          "{quoteText}"
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-gray-300"></div>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            {author}
          </p>
        </div>
      </div>
    </section>
  );
}
