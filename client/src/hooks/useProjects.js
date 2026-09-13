import { useState, useEffect, useCallback } from 'react';
import jobService from '@/services/jobService';
import useDebounce from './useDebounce';

export default function useProjects(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const debouncedSearch = useDebounce(filters.search || '', 400);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        ...filters,
        search: debouncedSearch,
      };
      const res = await jobService.getJobs(params);
      const data = res.data?.data;
      setProjects(data?.jobs || []);
      setPagination({
        page: data?.page || 1,
        totalPages: data?.pages || 1,
        total: data?.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    projects,
    loading,
    error,
    pagination,
    filters,
    updateFilter,
    clearFilters,
    refresh: fetchProjects,
  };
}
