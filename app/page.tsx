import Image from "next/image";
import OMTExample from "../components/OMTExample";
import OptimisticUIExample from "../components/OptimisticUIExample";
import FLIPExample from "../components/FLIPExample";
import IconGallery from "../components/IconGallery";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Decorative Neon Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 md:px-10 md:py-5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
            >
              <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2" />
              <polyline points="2 7 12 12 22 7" />
              <line x1="12" y1="22" x2="12" y2="12" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Dev<span className="text-neon-cyan">Icons</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            popoverTarget="features-popover"
            title="View Implemented Features"
            className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-widest uppercase py-2 px-4 rounded-none border border-white/20 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="hidden sm:inline">Features</span>
          </button>
          <a
            href="https://github.com/igmrrf/icons"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="flex items-center justify-center p-2 rounded-none border border-white/20 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-colors text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
              <path d="M9 18c-4.5 1-5-2.5-7-3" />
            </svg>
          </a>
        </div>
      </header>

      {/* Native Features Popover */}
      <div
        popover="auto"
        id="features-popover"
        className="bg-black/90 backdrop-blur-2xl border border-neon-cyan/50 p-8 rounded-2xl max-w-md w-[90vw] shadow-[0_0_30px_rgba(0,240,255,0.15)] text-white m-auto inset-0"
      >
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <h3 className="font-mono text-neon-cyan uppercase tracking-wider text-sm">
            Implemented Native Features
          </h3>
          <span className="font-mono text-xs text-gray-500">v0.1.0</span>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              View Transitions API
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Smooth FLIP animations on grid shuffle, sort, and filter using
              `document.startViewTransition`.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              HTML Popover API
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Native top-layer rendering (`popover="auto"`) for icon details,
              features, and advanced filtering without z-index hacks.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              Web Workers API
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Off-main-thread ZIP generation via `Comlink` to prevent UI
              freezing during bulk downloads.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              HTML5 Drag & Drop
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Native `onDragStart` with `DownloadURL` payloads for OS saving,
              and physical grid reordering.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              Intersection Observer
            </span>
            <span className="text-sm text-gray-400 font-sans">
              High-performance infinite scrolling without attaching to massive
              browser scroll events.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              CSS Container Queries
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Fluid responsive grid items utilizing `@container` logic decoupled
              from the viewport width.
            </span>
          </li>
          <li className="flex flex-col">
            <span className="font-mono text-xs text-neon-green uppercase mb-1">
              Web Share & Clipboard API
            </span>
            <span className="text-sm text-gray-400 font-sans">
              Native OS-level sharing sheets and clipboard access for jsDelivr
              links.
            </span>
          </li>
        </ul>

        <button
          popoverTarget="features-popover"
          popoverTargetAction="hide"
          className="font-mono text-xs uppercase px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg w-full transition-colors text-gray-300"
        >
          [ Close Matrix ]
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-start p-6 md:px-12 pt-32 sm:pt-28 pb-20 max-w-7xl mx-auto w-full">
        <IconGallery />
      </main>

      {/* Structural Footer / Feature Tests */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-3xl p-6 md:p-12 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
              Experimental_Modules
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-neon-cyan/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OMT Worker */}
            <div className="glass-panel rounded-xl p-5 border-l-2 border-l-neon-cyan border-t-0 border-r-0 border-b-0">
              <h4 className="font-mono text-[10px] text-gray-500 mb-3 tracking-widest">
                MODULE::OMT
              </h4>
              <div className="text-sm font-sans">
                <OMTExample />
              </div>
            </div>

            {/* Optimistic UI */}
            <div className="glass-panel rounded-xl p-5 border-l-2 border-l-neon-green border-t-0 border-r-0 border-b-0">
              <h4 className="font-mono text-[10px] text-gray-500 mb-3 tracking-widest">
                MODULE::OPTIMISTIC
              </h4>
              <div className="text-sm font-sans">
                <OptimisticUIExample />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
