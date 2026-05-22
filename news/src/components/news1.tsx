import React, { useState, useEffect } from "react";
import Loader from "./loader";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt?: string;
  source?: {
    name: string;
  };
  author?: string;
};

const categories = [
  "General",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
];

const API_KEY = "26a51f38ae6e432796e72eeef189a295";

const NewsApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Fetch news articles from the API
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to load news (status: ${response.status})`);
      }

      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch articles.");
      }

      setArticles(data.articles || []);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(
        err.message || "Unable to load articles. Please check your internet connection and try again."
      );
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

  // Live date string for header banner
  const getHeaderDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter articles by headline or description text
  const filteredArticles = articles.filter((article) => {
    const titleMatch = article.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = article.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 pb-16">
      
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 dark:shadow-none text-white select-none">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-500 via-violet-600 to-indigo-600 dark:from-sky-300 dark:via-violet-200 dark:to-indigo-300 bg-clip-text text-transparent leading-none">
                SKY NEWS
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                Real-Time Global Pulse
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Live Date (Hidden on mobile) */}
            <span className="hidden md:inline text-xs font-semibold text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 pr-4">
              {getHeaderDate()}
            </span>

            {/* Custom Sliding Dark Mode Toggle Switch */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-9 w-16 items-center rounded-full bg-slate-100 dark:bg-slate-900 transition-colors duration-300 border border-slate-200/60 dark:border-slate-800/80 p-0.5 cursor-pointer focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {/* Sun Icon */}
              <span className="absolute left-2 text-slate-400 dark:text-slate-500 pointer-events-none transition-opacity duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" />
                  <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </span>

              {/* Moon Icon */}
              <span className="absolute right-2 text-slate-400 dark:text-slate-500 pointer-events-none transition-opacity duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </span>

              {/* Knob */}
              <span
                className={`${
                  darkMode ? "translate-x-7 bg-violet-600 shadow-md shadow-violet-500/40" : "translate-x-0 bg-white shadow"
                } inline-block h-7.5 w-7.5 transform rounded-full transition-transform duration-300 z-10`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation & Search Hub Block */}
        <div className="bg-white dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-900/60 rounded-3xl p-6 mb-8 shadow-sm">
          
          {/* Action Row */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Dynamic Pill Scroll Bar */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar scroll-smooth">
                {categories.map((cat) => {
                  const isActive = category.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat.toLowerCase())}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer select-none ${
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 dark:shadow-none"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Local Search Input */}
            <div className="relative min-w-full sm:min-w-[320px]">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search headlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <Loader />}

        {/* Error Boundary Screen */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900/30 border border-red-100 dark:border-red-950/30 rounded-3xl shadow-sm max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">Failed to load headlines</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error}</p>
            <button
              onClick={fetchNews}
              className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors cursor-pointer select-none shadow-md shadow-violet-500/20"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty Search Results State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-white dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-900/60 rounded-3xl shadow-sm max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12h18M3 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No matching articles found</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              We couldn't find anything matching "{searchQuery}" in our {category} feed.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer select-none"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Dynamic Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                className="group flex flex-col bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-300 overflow-hidden"
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
                        // Render fallback on load error
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "";
                      }}
                    />
                  ) : (
                    // Stunning modern SVG gradient fallback placeholder
                    <div className="w-full h-full bg-gradient-to-tr from-violet-100 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                      <svg className="w-12 h-12 text-violet-400/50 dark:text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}

                  {/* Absolute Floating Publisher Tag */}
                  {article.source?.name && (
                    <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-100/50 dark:border-slate-800/50 shadow-sm">
                      {article.source.name}
                    </span>
                  )}
                </div>

                {/* Meta details row */}
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-3 space-x-2 font-medium">
                  {article.publishedAt && (
                    <>
                      <span>{formatDate(article.publishedAt)}</span>
                      <span className="text-[8px]">•</span>
                    </>
                  )}
                  <span className="truncate">
                    {article.author ? `By ${article.author.split(",")[0]}` : "Editorial Staff"}
                  </span>
                </div>

                {/* Uniform clamped Title */}
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-slate-50 line-clamp-2 mb-3.5 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                  {article.title}
                </h3>

                {/* Uniform clamped Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {article.description || "Headline reports breaking events across this sector. Click below to explore fully and access deep briefings."}
                </p>

                {/* Read Full Article Sliding Button */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
                  <a
                    href={article.url}
                    className="inline-flex items-center text-sm font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors group/link cursor-pointer"
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
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsApp;
