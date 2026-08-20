import * as Comlink from 'comlink';
import JSZip from 'jszip';

export interface IconZipItem {
  symbol: string;
  url: string;
  fileName?: string;
}

const zipApi = {
  async generateZip(icons: IconZipItem[]): Promise<Blob> {
    const zip = new JSZip();
    
    const batchSize = 20;
    for (let i = 0; i < icons.length; i += batchSize) {
      const batch = icons.slice(i, i + batchSize);
      const fetchTasks = batch.map(async (icon) => {
        try {
          const res = await fetch(icon.url);
          if (res.ok) {
            const text = await res.text();
            const targetName = icon.fileName || `${icon.symbol.toLowerCase()}.svg`;
            zip.file(targetName, text);
          }
        } catch (e) {
          console.error('Failed to fetch', icon.url, e);
        }
      });
      await Promise.all(fetchTasks);
    }

    return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  }
};

Comlink.expose(zipApi);
export type ZipApi = typeof zipApi;
