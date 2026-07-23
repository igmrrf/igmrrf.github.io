"use client";

function getHue(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max === min) return -1;
  if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  return Math.round(h * 60);
}

function getColorBucket(hex: string): string {
  if (!hex || !hex.startsWith('#')) return "Mono";
  const h = getHue(hex);
  if (h === -1) return "Mono";
  if (h < 15 || h >= 330) return "Red";
  if (h >= 15 && h < 50) return "Orange";
  if (h >= 50 && h < 70) return "Yellow";
  if (h >= 70 && h < 160) return "Green";
  if (h >= 160 && h < 260) return "Blue";
  if (h >= 260 && h < 330) return "Purple";
  return "Mono";
}

import { useState, useMemo, useTransition, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import * as Comlink from "comlink";
import { uniqBy } from "lodash";
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
  const [visibleCount, setVisibleCount] = useState(24);
  const [manualOrder, setManualOrder] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep track of grid slot IDs so they move physically during shuffle
  // Initialized to 1000 to comfortably cover the 400+ coins without bounds errors
  const [slotMap, setSlotMap] = useState<number[]>(Array.from({length: 1000}, (_, i) => i));

  const coins: Coin[] = useMemo(() => uniqBy(manifest, 'symbol'), []);

  const filteredCoins = useMemo(() => {
    let list = coins;
    
    if (colorFilter) {
      list = list.filter(c => getColorBucket(c.color) === colorFilter);
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.symbol.toLowerCase().includes(lowerSearch) ||
          c.name.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (shuffleSeed > 0) {
      list = [...list].sort(() => Math.random() - 0.5);
    } else if (sortOrder !== "default") {
      list = [...list].sort((a, b) => {
        if (sortOrder === "asc") return a.symbol.localeCompare(b.symbol);
        return b.symbol.localeCompare(a.symbol);
      });
    }
    
    if (manualOrder.length > 0) {
      const orderMap = new Map(manualOrder.map((sym, i) => [sym, i]));
      list = [...list].sort((a, b) => {
        const aIdx = orderMap.has(a.symbol) ? orderMap.get(a.symbol)! : 99999;
        const bIdx = orderMap.has(b.symbol) ? orderMap.get(b.symbol)! : 99999;
        return aIdx - bIdx;
      });
    }
    
    return list;
  }, [search, coins, shuffleSeed, manualOrder, colorFilter, sortOrder]);

  // Native LocalStorage API
  useEffect(() => {
    const savedVariant = localStorage.getItem("devicons-variant");
    if (savedVariant && ["color", "white", "black", "icon"].includes(savedVariant)) {
      setVariant(savedVariant as Variant);
    }
  }, []);

  // Native IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => Math.min(prev + 24, coins.length));
      }
    }, { rootMargin: "200px" });
    
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    
    return () => observerRef.current?.disconnect();
  }, [coins.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    startTransition(() => {
      setSearch(e.target.value);
      setVisibleCount(24);
      setManualOrder([]);
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

  const handleSortChange = (order: "default" | "asc" | "desc") => {
    executeWithTransition(() => {
      setSortOrder(order);
      setShuffleSeed(0);
      setManualOrder([]);
      setVisibleCount(24);
    });
  };

  const handleColorFilter = (color: string | null) => {
    executeWithTransition(() => {
      setColorFilter(color);
      setVisibleCount(24);
      setManualOrder([]);
    });
  };

  const handleVariantChange = (v: Variant) => {
    executeWithTransition(() => {
      setVariant(v);
      localStorage.setItem("devicons-variant", v);
    });
  };

  const handleShuffle = () => {
    executeWithTransition(() => {
      setShuffleSeed(prev => prev + 1);
      setVisibleCount(24);
      setManualOrder([]);
      setSlotMap(prev => [...prev].sort(() => Math.random() - 0.5));
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, coin: Coin) => {
    const url = `https://cdn.jsdelivr.net/gh/igmrrf/icons@main/public/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`;
    e.dataTransfer.setData("text/plain", url);
    e.dataTransfer.setData("text/uri-list", url);
    e.dataTransfer.setData("text/x-coin-symbol", coin.symbol);
    // This allows native drag-to-desktop saving on supported browsers
    e.dataTransfer.setData("DownloadURL", `image/svg+xml:${coin.symbol.toLowerCase()}.svg:${url}`);
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>, targetCoin: Coin) => {
    e.preventDefault();
    const sourceSymbol = e.dataTransfer.getData("text/x-coin-symbol");
    if (!sourceSymbol || sourceSymbol === targetCoin.symbol) return;
    
    executeWithTransition(() => {
      setManualOrder(prevOrder => {
        const currentList = prevOrder.length > 0 ? prevOrder : filteredCoins.map(c => c.symbol);
        const sourceIdx = currentList.indexOf(sourceSymbol);
        const targetIdx = currentList.indexOf(targetCoin.symbol);
        if (sourceIdx === -1 || targetIdx === -1) return currentList;
        
        const newList = [...currentList];
        newList.splice(sourceIdx, 1);
        newList.splice(targetIdx, 0, sourceSymbol);
        return newList;
      });
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleCopyUrl = (coinSymbol: string) => {
    const url = `https://cdn.jsdelivr.net/gh/igmrrf/icons@main/public/cryptocurrency/svg/${variant}/${coinSymbol.toLowerCase()}.svg`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(coinSymbol);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShare = async (coin: Coin) => {
    const url = `https://cdn.jsdelivr.net/gh/igmrrf/icons@main/public/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`;
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
        url: `https://cdn.jsdelivr.net/gh/igmrrf/icons@main/public/cryptocurrency/svg/${variant}/${coin.symbol.toLowerCase()}.svg`
      }));
      
      const blob = await api.generateZip(iconData);
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `devicons-${variant}.zip`;
      link.click();
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

        <div className="flex flex-row gap-3 items-center w-full lg:w-auto mt-4 lg:mt-0">
          <button
            onClick={handleDownloadAll}
            disabled={isZipping}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest rounded-md transition-all border ${
              isZipping 
                ? 'bg-purple-500/5 text-purple-500/50 border-purple-500/20 cursor-wait' 
                : 'bg-purple-500/10 text-purple-400 border-purple-500/50 hover:bg-purple-500/20'
            }`}
          >
            {isZipping ? (
              <svg className="animate-spin h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            )}
            <span>{isZipping ? 'Zipping' : 'Download'}</span>
          </button>

          <button
            popoverTarget="filter-popover"
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest rounded-md transition-all bg-black/50 text-gray-300 border border-white/20 hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
            <span>Filter</span>
            {(sortOrder !== "default" || colorFilter) && (
              <span className="w-2 h-2 rounded-full bg-neon-cyan ml-1 shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Popover */}
      <div 
        popover="auto" 
        id="filter-popover"
        className="bg-black/90 backdrop-blur-2xl border border-neon-cyan/50 p-6 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.15)] text-white mt-20 inset-x-0 mx-auto w-[90vw] max-w-sm sm:mt-4 sm:ml-auto sm:mr-4 sm:top-20"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-mono text-neon-cyan uppercase tracking-widest text-sm">Filter & Sort</h3>
            <button popoverTarget="filter-popover" popoverTargetAction="hide" className="text-gray-400 hover:text-white transition-colors">✕</button>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase mb-3">Asset Variant</p>
            <div className="grid grid-cols-2 gap-2">
              {(["color", "white", "black", "icon"] as Variant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => handleVariantChange(v)}
                  className={`px-3 py-2 font-mono text-[10px] uppercase tracking-widest rounded-md transition-colors ${
                    variant === v
                      ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase mb-3">Sort Alphabetical</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleSortChange("default")}
                className={`px-3 py-2 font-mono text-[10px] uppercase rounded-md transition-colors ${sortOrder === "default" ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >Default</button>
              <button 
                onClick={() => handleSortChange("asc")}
                className={`px-3 py-2 font-mono text-[10px] uppercase rounded-md transition-colors ${sortOrder === "asc" ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >A-Z</button>
              <button 
                onClick={() => handleSortChange("desc")}
                className={`px-3 py-2 font-mono text-[10px] uppercase rounded-md transition-colors ${sortOrder === "desc" ? "bg-white/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >Z-A</button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-gray-500 uppercase mb-3 flex items-center justify-between">
              Brand Color
              {colorFilter && (
                <button onClick={() => handleColorFilter(null)} className="text-[10px] text-neon-cyan hover:text-white">Clear</button>
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Red", bg: "bg-red-500" },
                { name: "Orange", bg: "bg-orange-500" },
                { name: "Yellow", bg: "bg-yellow-400" },
                { name: "Green", bg: "bg-green-500" },
                { name: "Blue", bg: "bg-blue-500" },
                { name: "Purple", bg: "bg-purple-500" },
                { name: "Mono", bg: "bg-gray-400" },
              ].map(c => (
                <button
                  key={c.name}
                  onClick={() => handleColorFilter(c.name)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${c.bg} ${colorFilter === c.name ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-6 z-10 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        {filteredCoins.slice(0, visibleCount).map((coin, index) => (
          <div 
            key={coin.symbol} 
            className="relative @container" 
            style={{ viewTransitionName: `icon-slot-${slotMap[index]}` } as React.CSSProperties}
          >
            <button
              popoverTarget={`popover-${coin.symbol}`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, coin)}
              onDrop={(e) => handleDrop(e, coin)}
              onDragOver={handleDragOver}
              title="Drag to desktop to save SVG natively, or drop on another icon to reorder"
              className="glass-panel rounded-xl p-3 @min-[120px]:p-6 relative group overflow-hidden border-white/10 hover:border-neon-cyan/50 transition-colors flex flex-col items-center w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-neon-cyan cursor-grab active:cursor-grabbing"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom right, ${coin.color}20, transparent)`,
                }}
              />
              
              <div className="h-10 w-10 @min-[120px]:h-16 @min-[120px]:w-16 mb-2 @min-[120px]:mb-4 flex items-center justify-center relative pointer-events-none">
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
              
              <div className="text-center relative z-10 w-full overflow-hidden @max-[119px]:hidden">
                <h3 className="font-mono text-[10px] @min-[120px]:text-xs text-white font-bold tracking-wider mb-0.5 @min-[120px]:mb-1 truncate w-full">
                  {coin.symbol}
                </h3>
                <p className="font-sans text-[8px] @min-[120px]:text-[10px] text-gray-400 truncate w-full">
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
      
      {/* Intersection Observer Sentinel */}
      <div ref={sentinelRef} className="w-full h-20 opacity-0 pointer-events-none" />

      {filteredCoins.length === 0 && (
        <div className="text-center py-20 font-mono text-neon-cyan border border-neon-cyan/20 glass-panel rounded-xl w-full">
          No icons found matching "{search}"
        </div>
      )}

      {visibleCount >= filteredCoins.length && filteredCoins.length > 0 && (
        <div className="text-center py-12 font-mono text-xs text-gray-500 uppercase tracking-widest w-full">
          End of results ({filteredCoins.length} items)
        </div>
      )}
    </div>
  );
}
