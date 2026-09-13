import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionClick,
  loading = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSubmit) onSubmit(value);
  };

  const showSuggestions = isOpen && (suggestions.length > 0 || loading);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-lg', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full rounded-full border-0 py-2.5 pl-10 pr-10 text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white shadow-sm ring-1 ring-inset ring-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-card bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
          >
            {loading ? (
              <div className="p-4 flex justify-center items-center">
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <ul className="max-h-80 overflow-auto py-1">
                {suggestions.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        onSuggestionClick?.(item);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-3"
                    >
                      {item.icon && <item.icon className="h-4 w-4 text-slate-400" />}
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.label}
                        </div>
                        {item.category && (
                          <div className="text-xs text-slate-500">{item.category}</div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
