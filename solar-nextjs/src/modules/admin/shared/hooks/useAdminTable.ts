'use client';

import { useState, useMemo, useCallback } from 'react';

interface UseAdminTableOptions<T> {
  data: T[];
  searchKeys?: (keyof T)[];
  defaultPageSize?: number;
}

export function useAdminTable<T extends Record<string, unknown>>({
  data,
  searchKeys = [],
  defaultPageSize = 20,
}: UseAdminTableOptions<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = [...data];
    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) =>
          String(row[key] ?? '')
            .toLowerCase()
            .includes(q)
        )
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleSort = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
      setPage(1);
    },
    [sortKey]
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((r) => String(r.id ?? ''))));
    }
  }, [selected, paginated]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  return {
    search,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    setPageSize,
    sortKey,
    sortDir,
    handleSort,
    filtered,
    paginated,
    totalPages,
    total: filtered.length,
    selected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}
