import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CategoryCard from './CategoryCard';


const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:5000';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default order' },
  { value: 'az', label: 'Name (A to Z)' },
  { value: 'za', label: 'Name (Z to A)' },
];

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-lime-100 bg-white p-4 shadow-sm">
    <div className="h-28 w-full rounded-lg bg-lime-100" />
    <div className="mt-4 h-4 w-2/3 rounded bg-lime-100" />
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const fetchCategories = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/category/all`, { signal });
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.categories ?? [];
      setCategories(data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Error fetching categories:', err.message);
      setError(
        err.response
          ? 'The server could not load the categories. Please try again.'
          : 'Could not reach the server. Check your connection and try again.'
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCategories]);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? categories.filter((c) => (c.name ?? '').toLowerCase().includes(query))
      : categories;

    if (sort === 'default') return filtered;
    const sorted = [...filtered].sort((a, b) =>
      (a.name ?? '').localeCompare(b.name ?? '')
    );
    return sort === 'za' ? sorted.reverse() : sorted;
  }, [categories, search, sort]);

  const handleRetry = () => fetchCategories();

  return (
    <section className="py-12" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="categories-heading" className="text-3xl font-extrabold text-lime-800 text-center mb-2">
          Discover Our Services
        </h2>
        {!loading && !error && categories.length > 0 && (
          <p className="text-center text-sm text-gray-500 mb-6">
            Showing {visibleCategories.length} of {categories.length} categories
          </p>
        )}

        {!error && (loading || categories.length > 0) && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <label htmlFor="category-search" className="sr-only">
                Search categories
              </label>
              <input
                id="category-search" type="search"
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories" disabled={loading} className="w-full rounded-lg border border-lime-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="category-sort" className="text-sm text-gray-600">
                Sort by
              </label>
              <select
                id="category-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-lime-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:opacity-50"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center"
          >
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-lime-700 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            aria-busy="true"
            aria-label="Loading categories"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && visibleCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {visibleCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-gray-500">
            No services are available yet. Check back soon.
          </p>
        )}

        {!loading && !error && categories.length > 0 && visibleCategories.length === 0 && (
          <div className="text-center">
            <p className="text-gray-600">
              No categories match &ldquo;{search}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-3 text-sm font-semibold text-lime-800 underline hover:text-lime-900"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;