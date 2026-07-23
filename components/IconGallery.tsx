"use client";

import { useState, useMemo, useTransition } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import * as Comlink from "comlink";
import type { ZipApi } from "../lib/zip-worker";
import manifest from "../public/cryptocurrency/manifest.json";

type Variant = "color" | "black" | "white" | "icon";

interface Coin {
  symbol: string;
  name: string;
  color: string;
}

export default function IconGallery() {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [variant, setVariant] = useState<Variant>("color");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  
  // Keep track of grid slot IDs so they move physically during shuffle
  const [slotMap, setSlotMap] = useState<number[]>(Array.from({length: 100}, (_, i) => i));

  const coins: Coin[] = manifest;

  const filteredCoins = useMemo(() => {
    let list = coins;
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      list = coins.filter(
        (c) =>
          c.symbol.toLowerCase().includes(lowerSearch) ||
          c.name.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (shuffleSeed > 0) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    
    return list;
  }, [search, coins, shuffleSeed]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    startTransition(() => {
      setSearch(e.target.value);
    });
  };

  const executeWithTransition = (callback: () => void) => {
    if (typeof document !== "undefined" && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        flushSync(() => {
          callback();
        });
      });
    } else {
      callback();
    }
  };

  const handleVariantChange = (v: Variant) => {
    executeWithTransition(() => setVariant(v));
  };

  const handleShuffle = () => {
    executeWithTransition(() => {
      setShuffleSeed(prev => prev + 1);
      setSlotMap(prev => [...prev].sort(() => Math.random() - 0.5));
    });
  };

  const handleCopyUrl = (coinSymbol: string) => {
    const url = `https://cdn.jsdelivr.net/gh/igmrrf/native-icons@main/public/cryptocurrency/svg/${variant}/${coinSymbol.toLowerCase()}.svg`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(coinSymbol);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShare = async (coin: Coin) => {
    const url = `https://cdn.jsdelivr.net/gh/igmrrf/native-icons@main/public/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${coin.name} Icon`,
          text: `Check out the ${coin.name} icon on DevIcons!`,
          url: url
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyUrl(coin.symbol);
    }
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const worker = new Worker(new URL('../lib/zip-worker.ts', import.meta.url), { type: 'module' });
      const api = Comlink.wrap<ZipApi>(worker);
      
      const iconData = filteredCoins.map(coin => ({
        symbol: coin.symbol,
        url: `https://cdn.jsdelivr.net/gh/igmrrf/native-icons@main/public/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`
      }));
      
      const blob = await api.generateZip(iconData);
      
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `devicons-${variant}.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
      worker.terminate();
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center mb-24">
      {/* Controls */}
      <div className="glass-panel rounded-2xl p-6 w-full mb-12 flex flex-col lg:flex-row gap-6 justify-between border-neon-cyan/30 z-20 sticky top-4">
        <div className="flex w-full flex-1 gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search icons (e.g. BTC, Ethereum)..."
              value={inputValue}
              onChange={handleSearch}
              className="w-full h-full bg-black/50 border border-white/20 rounded-lg py-3 pl-4 pr-28 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
              {isPending && <span className="w-3 h-3 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />}
              <span className="text-neon-cyan font-mono text-xs uppercase tracking-widest hidden sm:inline">
                [ Input ]
              </span>
              <span className="text-neon-cyan font-mono text-xs uppercase tracking-widest sm:hidden">
                [ ]
              </span>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            title="Shuffle Icons"
            className="flex-shrink-0 w-[52px] h-[52px] rounded-lg transition-all bg-black/50 text-gray-400 border border-white/20 hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center w-full lg:w-auto">
          <button
            onClick={handleDownloadAll}
            disabled={isZipping}
            className={`w-full sm:w-auto px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-md transition-all border ${
              isZipping 
                ? 'bg-purple-500/5 text-purple-500/50 border-purple-500/20 cursor-wait' 
                : 'bg-purple-500/10 text-purple-400 border-purple-500/50 hover:bg-purple-500/20'
            }`}
          >
            {isZipping ? 'Zipping...' : 'Download All'}
          </button>

          <div className="flex flex-wrap justify-center bg-black/50 border border-white/20 rounded-lg p-1 w-full sm:w-auto">
            {(["color", "white", "black", "icon"] as Variant[]).map((v) => (
              <button
                key={v}
                onClick={() => handleVariantChange(v)}
                className={`flex-1 sm:flex-none px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-md transition-colors ${
                  variant === v
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-6 z-10 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        {filteredCoins.slice(0, 24).map((coin, index) => (
          <div 
            key={coin.symbol} 
            className="relative" 
            style={{ viewTransitionName: `icon-slot-${slotMap[index]}` } as React.CSSProperties}
          >
            <button
              popoverTarget={`popover-${coin.symbol}`}
              className="glass-panel rounded-xl p-3 sm:p-6 relative group overflow-hidden border-white/10 hover:border-neon-cyan/50 transition-colors flex flex-col items-center w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to bottom right, ${coin.color}20, transparent)`,
                }}
              />
              
              <div className="h-10 w-10 sm:h-16 sm:w-16 mb-2 sm:mb-4 flex items-center justify-center relative">
                <Image
                  className={`transition-transform duration-500 group-hover:scale-110 w-full h-full object-contain ${variant === 'black' ? 'drop-shadow-none' : 'drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}
                  src={`/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`}
                  alt={`${coin.name} Logo`}
                  width={64}
                  height={64}
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0';
                  }}
                />
              </div>
              
              <div className="text-center relative z-10 w-full overflow-hidden">
                <h3 className="font-mono text-[10px] sm:text-xs text-white font-bold tracking-wider mb-0.5 sm:mb-1 truncate w-full">
                  {coin.symbol}
                </h3>
                <p className="font-sans text-[8px] sm:text-[10px] text-gray-400 truncate w-full">
                  {coin.name}
                </p>
              </div>
            </button>

            {/* Native HTML Popover for details */}
            <div 
              popover="auto" 
              id={`popover-${coin.symbol}`}
              className="bg-black/90 backdrop-blur-2xl border border-neon-cyan/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.15)] text-white m-auto inset-0 w-[90vw] max-w-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative group"
                  style={{ backgroundColor: `${coin.color}20`, border: `1px solid ${coin.color}50` }}
                >
                  <Image
                    src={`/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`}
                    alt={`${coin.name} Logo`}
                    width={48}
                    height={48}
                    unoptimized
                  />
                </div>
                <h2 className="font-mono text-xl text-white font-bold mb-1">{coin.name}</h2>
                <p className="font-mono text-xs text-neon-cyan tracking-widest mb-6">{coin.symbol}</p>
                
                <div className="w-full flex flex-col sm:flex-row gap-3 mb-6">
                  <a 
                    href={`/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`}
                    download={`${coin.symbol.toLowerCase()}-${variant}.svg`}
                    className="flex-1 font-mono text-[10px] uppercase py-3 sm:py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md transition-colors text-center flex items-center justify-center"
                  >
                    Download SVG
                  </a>
                  <button 
                    onClick={() => handleCopyUrl(coin.symbol)}
                    className={`flex-1 font-mono text-[10px] uppercase py-3 sm:py-2 border rounded-md transition-colors text-center flex items-center justify-center ${
                      copiedId === coin.symbol 
                        ? 'bg-neon-green/20 border-neon-green text-neon-green' 
                        : 'bg-neon-cyan/10 hover:bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan'
                    }`}
                  >
                    {copiedId === coin.symbol ? 'Copied URL!' : 'Copy URL'}
                  </button>
                  <button 
                    onClick={() => handleShare(coin)}
                    className="flex-1 font-mono text-[10px] uppercase py-3 sm:py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-md transition-colors text-center flex items-center justify-center"
                  >
                    Share
                  </button>
                </div>

                <div className="w-full bg-white/5 rounded-lg p-4 mb-6 border border-white/10 text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1 sm:gap-0">
                    <span className="font-mono text-xs text-gray-400 uppercase">Brand Color</span>
                    <span className="font-mono text-xs text-white uppercase">{coin.color}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-mono text-xs text-gray-400 uppercase">Registry ID</span>
                    <span className="font-mono text-xs text-white uppercase">IDX-{coin.symbol}</span>
                  </div>
                </div>

                <button 
                  popoverTarget={`popover-${coin.symbol}`}
                  popoverTargetAction="hide"
                  className="font-mono text-xs uppercase px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg w-full transition-colors"
                >
                  [ Close Module ]
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-20 font-mono text-neon-cyan border border-neon-cyan/20 glass-panel rounded-xl w-full">
          No icons found matching "{search}"
        </div>
      )}
      
      {filteredCoins.length > 24 && (
        <div className="mt-12 font-mono text-xs text-gray-500 uppercase tracking-widest">
          Showing 24 of {filteredCoins.length} items. Use search to find more.
        </div>
      )}
    </div>
  );
}
