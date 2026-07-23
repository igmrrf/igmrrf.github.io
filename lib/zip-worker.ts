import * as Comlink from 'comlink';
import JSZip from 'jszip';

const zipApi = {
  async generateZip(icons: { symbol: string; url: string }[]): Promise<Blob> {
    const zip = new JSZip();
    
    const batchSize = 20;
    for (let i = 0; i < icons.length; i += batchSize) {
      const batch = icons.slice(i, i + batchSize);
      await Promise.all(batch.map(async (icon) => {
        try {
          const res = await fetch(icon.url);
          const text = await res.text();
          zip.file(`${icon.symbol.toLowerCase()}.svg`, text);
        } catch (e) {
          console.error('Failed to fetch', icon.url);
        }
      }));
    }

    return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  }
};

Comlink.expose(zipApi);
export type ZipApi = typeof zipApi;
