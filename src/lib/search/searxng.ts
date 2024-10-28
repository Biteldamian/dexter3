import fetch from 'node-fetch';

interface SearchOptions {
  engines?: string[];
  language?: string;
  time_range?: string;
  safesearch?: number;
}

interface SearchResult {
  title: string;
  url: string;
  content: string;
  img_src?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export async function searchSearxng(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const searchUrl = process.env.SEARXNG_URL || 'https://searx.be';
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    ...(options.engines && { engines: options.engines.join(',') }),
    ...(options.language && { language: options.language }),
    ...(options.time_range && { time_range: options.time_range }),
    ...(options.safesearch !== undefined && { safesearch: options.safesearch.toString() })
  });

  try {
    const response = await fetch(`${searchUrl}/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      query,
      results: data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        ...(result.img_src && { img_src: result.img_src })
      }))
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      query,
      results: []
    };
  }
}</content></file>

<boltAction type="file" filePath="vite.config.ts">
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    exclude: ['@esbuild/darwin-x64']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});