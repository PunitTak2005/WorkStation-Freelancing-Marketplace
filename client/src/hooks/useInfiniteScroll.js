import { useEffect, useRef, useState, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore = true) => {
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await callback();
    setLoading(false);
  }, [loading, hasMore, callback]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore]);

  return { ref: observerRef, loading };
};
