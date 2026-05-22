import React, { useState, useEffect } from "react";
import Loader from "./loader";
import { fallbackArticles } from "./fallbackData";
import type { Article } from "./fallbackData";

const categories = [
  { name: "General", icon: "📰" },
  { name: "Business", icon: "💼" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Health", icon: "🩺" },
  { name: "Science", icon: "🔬" },
  { name: "Sports", icon: "🏆" },
  { name: "Technology", icon: "💻" }
];

const API_KEY = "26a51f38ae6e432796e72eeef189a295";

const NewsApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmarks state persistent in localStorage
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("news_bookmarks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Theme state persisted in localStorage. Default is dark theme.
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return true; // Default to dark theme
    }
    return true;
  });

  // Apply theme class to document elements
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Sync bookmarks changes to localStorage
  useEffect(() => {
    localStorage.setItem("news_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Fetch news articles from the API, with robust mock fallback
  const fetchNews = async () => {
    setLoading(true);
    setIsFallbackMode(false);
    setSelectedSource("all"); // Reset source filter on category change
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch articles.");
      }

      if (!data.articles || data.articles.length === 0) {
        throw new Error("No live headlines found.");
      }

      // Filter out removed or broken items if any
      const validArticles = data.articles.filter(
        (art: Article) => art.title && art.title !== "[Removed]"
      );
      
      setArticles(validArticles);
    } catch (err: any) {
      console.warn("Live API fetch failed. Reverting to offline curated articles:", err);
      // Fetch fallback articles for the category
      const fallbackList = fallbackArticles[category] || fallbackArticles["general"] || [];
      setArticles(fallbackList);
      setIsFallbackMode(true);
      showToast("Activated offline mode: Viewing curated backup news. 🌐");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  // Format publication date beautifully
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Live greeting & date strings for header banner
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getHeaderDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Toggle bookmark function
  const toggleBookmark = (article: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url);
      if (exists) {
        showToast("Removed from Bookmarks 📑");
        return prev.filter((b) => b.url !== article.url);
      } else {
        showToast("Saved to Bookmarks 📑");
        return [...prev, article];
      }
    });
  };

  const isBookmarked = (url: string) => {
    return bookmarks.some((b) => b.url === url);
  };

  // Reading time estimator helper
  const calculateReadingTime = (title: string, desc: string) => {
    const wordCount = (title + " " + (desc || "")).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200)); // Average 200 WPM
  };

  // Trigger popup alerts/toasts
  const showToast = (message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  };

  // Handle sharing of article
  const handleShare = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url)
      .then(() => showToast("Copied story link to clipboard! 🔗"))
      .catch(() => showToast("Failed to copy link."));
  };

  // Dynamic extraction of unique sources from current active articles
  const uniqueSources = Array.from(
    new Set(articles.map((art) => art.source?.name).filter(Boolean))
  ) as string[];

  // Filter articles based on search query AND source selection
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSource =
      selectedSource === "all" || article.source?.name === selectedSource;
      
    return matchesSearch && matchesSource;
  });

  // Helper function to highlight matched search text
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Separate the first article as the featured HERO story, rest in the grid
  const heroArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 pb-20 relative">
      
      {/* Dynamic Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-800 dark:border-slate-200 transition-all font-semibold text-sm max-w-sm">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* API Fallback Mode Alert Banner */}
      {isFallbackMode && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white py-2 px-4 text-xs font-bold text-center tracking-wide shadow-sm flex items-center justify-center space-x-2 animate-pulse">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Curated Offline Mode active. Live feed API is offline or rate-limited.</span>
        </div>
      )}

      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/60 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Identity */}
          <div className="flex items-center space-x-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105 select-none">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">News</span>
                <span className="font-light text-2xl tracking-tight text-violet-600 dark:text-violet-400 font-sans">Daily</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 leading-none">
                Your Premium Global Pulse
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Live Greetings (Hidden on mobile) */}
            <span className="hidden md:inline text-xs font-bold text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 pr-4">
              {getGreeting()} • {getHeaderDate()}
            </span>

            {/* Bookmarks Toggle Trigger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 transition-all select-none cursor-pointer group"
              aria-label="Open Bookmarks"
            >
              <svg className="w-5.5 h-5.5 text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white dark:border-slate-950">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Custom Sliding Dark Mode Toggle Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-9 w-16 items-center rounded-full bg-slate-100 dark:bg-slate-900 transition-colors duration-300 border border-slate-200/60 dark:border-slate-800/80 p-0.5 cursor-pointer focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {/* Sun Icon */}
              <span className="absolute left-2 text-slate-400 dark:text-slate-500 pointer-events-none transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" />
                  <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </span>

              {/* Moon Icon */}
              <span className="absolute right-2 text-slate-400 dark:text-slate-500 pointer-events-none transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </span>

              {/* Knob */}
              <span
                className={`${
                  darkMode ? "translate-x-7 bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/40" : "translate-x-0 bg-white shadow"
                } inline-block h-7.5 w-7.5 transform rounded-full transition-transform duration-300 z-10`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Bookmarks Slide-Out Drawer Component */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl p-6 border-l border-slate-200 dark:border-slate-800/80 flex flex-col justify-between drawer-transition ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-2.5">
                <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h2 className="text-xl font-bold font-heading">Bookmarked Stories</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bookmarks List Container */}
            <div className="overflow-y-auto max-h-[calc(100vh-180px)] pr-2 space-y-4 no-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400 dark:text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800/40">
                    <svg className="w-7 h-7 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold">Your reading list is currently empty.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-[240px] mx-auto">
                    Click the bookmark icon on any card to save high-interest headlines.
                  </p>
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.url}
                    className="relative group bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-900/60 flex items-start space-x-3 shadow-sm hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-300"
                  >
                    {bookmark.urlToImage && (
                      <img
                        src={bookmark.urlToImage}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover bg-slate-200 dark:bg-slate-900"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                        <span>{bookmark.source?.name || "Editorial"}</span>
                      </div>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm font-bold text-slate-900 dark:text-slate-50 line-clamp-2 hover:text-violet-600 dark:hover:text-violet-400 leading-snug transition-colors"
                      >
                        {bookmark.title}
                      </a>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(bookmark, e)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-md transition-opacity cursor-pointer duration-300"
                      title="Remove Bookmark"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors cursor-pointer select-none text-center"
            >
              Continue Reading
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* stand-alone Category Navigation Pills */}
        <div className="relative w-full mb-6 min-w-0">
          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 pointer-events-none z-10" />
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 pointer-events-none z-10" />
          
          <div className="flex items-center space-x-2.5 overflow-x-auto py-2 px-4 no-scrollbar scroll-smooth w-full">
            {categories.map((cat) => {
              const isActive = category.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name.toLowerCase())}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer select-none flex items-center space-x-2 border shadow-sm ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/50 dark:border-slate-800/50"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dedicated Search & Source Filter Panel */}
        <div className="bg-white dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-900/60 rounded-3xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 w-full">
            
            {/* Live Feed Category Indicator Label */}
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600 dark:bg-violet-400"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                Viewing <span className="text-violet-600 dark:text-violet-450">{category}</span> headlines
              </span>
            </div>

            {/* Filters Row Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
              
              {/* Dynamic Publisher Source Filter */}
              {uniqueSources.length > 0 && (
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full sm:w-48 appearance-none pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-xs font-bold transition-all text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm"
                  >
                    <option value="all">📰 All Sources ({articles.length})</option>
                    {uniqueSources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-450">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              )}

              {/* Interactive Local Search Input */}
              <div className="relative w-full sm:w-[280px]">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-505" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search current headlines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm font-medium transition-all shadow-sm"
                />
              </div>

            </div>

          </div>
        </div>

        {/* Loading State Skeleton Grid */}
        {loading && <Loader />}

        {/* Empty Search Results State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-900/60 rounded-3xl shadow-sm max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12h18M3 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No matching articles found</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              We couldn't find anything matching your filters or query in our {category} feed.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSource("all");
              }}
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer select-none"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Headlines Output */}
        {!loading && filteredArticles.length > 0 && (
          <div className="space-y-6 animate-fade-in">

            {/* Top Headline Section Header */}
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600"></span>
              <h2 className="text-xl font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
                Top Headline
              </h2>
            </div>

            {/* Premium Asymmetric Hero Featured Article Block */}
            {heroArticle && (
              <div className="group relative bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-300 overflow-hidden neon-border">
                
                {/* Horizontal split on large screens */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  
                  {/* Left Hero Cover Image Panel */}
                  <div className="relative w-full lg:w-3/5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[260px] lg:min-h-0">
                    {heroArticle.urlToImage ? (
                      <img
                        src={heroArticle.urlToImage}
                        alt={heroArticle.title}
                        loading="eager"
                        className="w-full h-full object-cover lg:absolute lg:inset-0 group-hover:scale-102 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[300px] bg-gradient-to-tr from-violet-100 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                        <svg className="w-16 h-16 text-violet-400/50 dark:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Premium Featured Story Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md">
                        ★ TOP STORY
                      </span>
                      {heroArticle.source?.name && (
                        <span className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-white/95 dark:bg-slate-950/85 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-100/50 dark:border-slate-800/50 shadow-sm">
                          {heroArticle.source.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Hero Cover Typography and Details */}
                  <div className="w-full lg:w-2/5 flex flex-col justify-between py-2">
                    
                    <div>
                      {/* Meta details row */}
                      <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-4 space-x-2 font-bold uppercase tracking-wide">
                        {heroArticle.publishedAt && (
                          <>
                            <span>{formatDate(heroArticle.publishedAt)}</span>
                            <span className="text-[10px] text-slate-300 dark:text-slate-800">•</span>
                          </>
                        )}
                        <span className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          {calculateReadingTime(heroArticle.title, heroArticle.description)} min read
                        </span>
                      </div>

                      {/* Editorial Title */}
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 leading-tight mb-5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                        {renderHighlightedText(heroArticle.title, searchQuery)}
                      </h3>

                      {/* Editorial Description */}
                      <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                        {renderHighlightedText(
                          heroArticle.description || "Headline reports breaking events across this sector. Click below to explore fully and access deep briefings.",
                          searchQuery
                        )}
                      </p>
                    </div>

                    {/* Bottom controls & bookmarks */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
                      <a
                        href={heroArticle.url}
                        className="inline-flex items-center text-base font-extrabold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors group/link cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read Full Story
                        <svg
                          className="w-5 h-5 ml-1.5 transform group-hover/link:translate-x-1.5 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>

                      <div className="flex items-center space-x-2">
                        {/* Share button */}
                        <button
                          onClick={(e) => handleShare(heroArticle.url, e)}
                          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer transition-colors"
                          title="Share Story"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.757-2.486m0 0a3 3 0 10-1.198-2.598c0 .248.03.49.088.72l-4.757 2.486m4.757 2.486a3 3 0 11-1.198 2.598c0-.248.03-.49.088-.72l-4.757-2.486m0 0a3 3 0 100-5.196M8 12a1 1 0 100-2 1 1 0 000 2z" />
                          </svg>
                        </button>
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(heroArticle, e)}
                          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                            isBookmarked(heroArticle.url)
                              ? "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800 text-violet-600 dark:text-violet-400"
                              : "border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500"
                          }`}
                          title={isBookmarked(heroArticle.url) ? "Unsave" : "Bookmark Story"}
                        >
                          <svg className="w-4.5 h-4.5" fill={isBookmarked(heroArticle.url) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Standard Articles Grid */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridArticles.map((article) => (
                  <div
                    className="group flex flex-col bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-300 overflow-hidden"
                    key={article.url}
                  >
                    
                    {/* Standard Aspect Ratio Image Frame */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-violet-100 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                          <svg className="w-12 h-12 text-violet-400/50 dark:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}

                      {/* Absolute Floating Publisher Tag */}
                      {article.source?.name && (
                        <span className="absolute top-3 left-3 px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full bg-white/95 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-100/50 dark:border-slate-800/50 shadow-sm">
                          {article.source.name}
                        </span>
                      )}
                    </div>

                    {/* Meta details row */}
                    <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 mb-3 space-x-2 font-bold uppercase tracking-wider">
                      {article.publishedAt && (
                        <>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span className="text-[8px] text-slate-300 dark:text-slate-800">•</span>
                        </>
                      )}
                      <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                        {calculateReadingTime(article.title, article.description)} min read
                      </span>
                    </div>

                    {/* Uniform clamped Title */}
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 line-clamp-2 mb-3 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                      {renderHighlightedText(article.title, searchQuery)}
                    </h3>

                    {/* Uniform clamped Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                      {renderHighlightedText(
                        article.description || "Headline reports breaking events across this sector. Click below to explore fully and access deep briefings.",
                        searchQuery
                      )}
                    </p>

                    {/* Read Full Article Sliding Button */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
                      <a
                        href={article.url}
                        className="inline-flex items-center text-sm font-extrabold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors group/link cursor-pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read Full Story
                        <svg
                          className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-1.5 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>

                      <div className="flex items-center space-x-2">
                        {/* Share Button */}
                        <button
                          onClick={(e) => handleShare(article.url, e)}
                          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer transition-colors"
                          title="Share Story"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.757-2.486m0 0a3 3 0 10-1.198-2.598c0 .248.03.49.088.72l-4.757 2.486m4.757 2.486a3 3 0 11-1.198 2.598c0-.248.03-.49.088-.72l-4.757-2.486m0 0a3 3 0 100-5.196M8 12a1 1 0 100-2 1 1 0 000 2z" />
                          </svg>
                        </button>
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(article, e)}
                          className={`p-2 rounded-full border transition-all cursor-pointer ${
                            isBookmarked(article.url)
                              ? "bg-violet-50 border-violet-200 dark:bg-violet-950/40 dark:border-violet-800 text-violet-600 dark:text-violet-400"
                              : "border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400"
                          }`}
                          title={isBookmarked(article.url) ? "Unsave" : "Bookmark Story"}
                        >
                          <svg className="w-4 h-4" fill={isBookmarked(article.url) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default NewsApp;
