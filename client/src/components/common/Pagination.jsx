import React, { useEffect, useRef } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  // Infinite scroll props
  hasMore,
  loading,
  onLoadMore,
  // Page button props
  currentPage,
  totalPages,
  onPageChange,
  page,
  pages,
}) => {
  const activePage = currentPage || page || 1;
  const totalPageCount = totalPages || pages || 1;

  // 1. If page button props are provided, render numbered pagination bar
  if (onPageChange || totalPageCount > 1 || activePage > 1) {
    if (totalPageCount <= 1) return null;

    const handlePrev = () => {
      if (activePage > 1 && onPageChange) {
        onPageChange(activePage - 1);
      }
    };

    const handleNext = () => {
      if (activePage < totalPageCount && onPageChange) {
        onPageChange(activePage + 1);
      }
    };

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      for (
        let i = Math.max(2, activePage - delta);
        i <= Math.min(totalPageCount - 1, activePage + delta);
        i++
      ) {
        range.push(i);
      }

      if (activePage - delta > 2) {
        range.unshift('...');
      }
      if (activePage + delta < totalPageCount - 1) {
        range.push('...');
      }

      range.unshift(1);
      if (totalPageCount > 1) {
        range.push(totalPageCount);
      }

      return range;
    };

    const pageNumbers = getPageNumbers();

    return (
      <nav
        aria-label="Pagination"
        className="flex items-center justify-center gap-1.5 sm:gap-2 py-4 select-none"
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={activePage <= 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 disabled:hover:text-slate-700 dark:disabled:hover:text-slate-300 shadow-xs transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 text-xs tracking-widest"
                >
                  ...
                </span>
              );
            }
            const isCurrent = p === activePage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                className={`min-w-[36px] h-9 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={activePage >= totalPageCount}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 disabled:hover:text-slate-700 dark:disabled:hover:text-slate-300 shadow-xs transition-all"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </nav>
    );
  }

  // 2. Infinite scroll IntersectionObserver mode
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  if (!hasMore && !loading) return null;

  return (
    <div ref={observerTarget} className="flex justify-center py-6 w-full">
      {loading && (
        <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
      )}
    </div>
  );
};

export default Pagination;
