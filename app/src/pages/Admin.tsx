import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './admin.css';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'wes_admin_token';

type Registration = {
  _id: string;
  fullName?: string;
  age?: number;
  whatsappNumber?: string;
  email?: string;
  district?: string;
  gpay?: string;
  ventureName?: string;
  industry?: string;
  businessStage?: string;
  businessScale?: string;
  createdAt?: string;
};

type ListResponse = {
  items: Registration[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type StatsResponse = {
  total: number;
  byIndustry: { _id: string; count: number }[];
  byStage: { _id: string; count: number }[];
  byScale: { _id: string; count: number }[];
};

type OptionsResponse = {
  industry: string[];
  businessStage: string[];
  businessScale: string[];
};

type Filters = {
  search: string;
  industry: string;
  businessStage: string;
  businessScale: string;
  district: string;
};

type Toast = { id: number; message: string; kind: 'success' | 'error' };

function formatDate(s?: string, full = false) {
  if (!s) return '—';
  const d = new Date(s);
  if (full) return d.toLocaleString();
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

async function apiRequest(
  path: string,
  opts: { method?: string; body?: unknown; token?: string | null; raw?: boolean } = {}
): Promise<Response> {
  if (!API_URL) throw new Error('Server URL not configured');
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  return res;
}

async function apiJson<T>(
  path: string,
  opts: Parameters<typeof apiRequest>[1] = {}
): Promise<T> {
  const res = await apiRequest(path, opts);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    const err = new Error(data.error || 'Session expired');
    (err as Error & { code?: number }).code = 401;
    throw err;
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  industry: '',
  businessStage: '',
  businessScale: '',
  district: '',
};

const SORT_FIELDS: { value: string; label: string }[] = [
  { value: 'createdAt', label: 'Submitted At' },
  { value: 'fullName', label: 'Full Name' },
  { value: 'age', label: 'Age' },
  { value: 'email', label: 'Email' },
  { value: 'district', label: 'District' },
  { value: 'industry', label: 'Industry' },
  { value: 'businessStage', label: 'Stage' },
  { value: 'businessScale', label: 'Scale' },
  { value: 'ventureName', label: 'Venture' },
];

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const handleLogin = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div className="admin-shell">
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} onToast={showToast} />
      ) : (
        <Login onSuccess={handleLogin} />
      )}
      {toast && (
        <div className={`toast ${toast.kind}`} key={toast.id}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ----------------- LOGIN ----------------- */

function Login({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiJson<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      onSuccess(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-strong w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="admin-display text-3xl font-bold tracking-tight">WES Admin</div>
          <div className="text-white/60 text-sm mt-2">Sign in to manage registrations</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              className="input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          <button type="submit" className="pill pill-primary w-full mt-2" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ----------------- DASHBOARD ----------------- */

function Dashboard({
  token,
  onLogout,
  onToast,
}: {
  token: string;
  onLogout: () => void;
  onToast: (message: string, kind?: 'success' | 'error') => void;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [options, setOptions] = useState<OptionsResponse>({
    industry: [],
    businessStage: [],
    businessScale: [],
  });
  const [list, setList] = useState<ListResponse | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Registration | null>(null);

  const handleAuthError = useCallback(
    (err: unknown) => {
      const e = err as Error & { code?: number };
      if (e?.code === 401) {
        onLogout();
        return true;
      }
      return false;
    },
    [onLogout]
  );

  // load stats + options once
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiJson<OptionsResponse>('/api/registrations/options');
        if (active) setOptions(data);
      } catch {
        // non-fatal
      }
    })();
    (async () => {
      try {
        const data = await apiJson<StatsResponse>('/api/admin/registrations/stats', { token });
        if (active) setStats(data);
      } catch (err) {
        if (!handleAuthError(err)) onToast((err as Error).message, 'error');
      }
    })();
    return () => {
      active = false;
    };
  }, [token, handleAuthError, onToast]);

  // load list whenever query state changes
  useEffect(() => {
    let active = true;
    setListLoading(true);
    setListError(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortDir,
    });
    (Object.entries(filters) as [keyof Filters, string][]).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    (async () => {
      try {
        const data = await apiJson<ListResponse>(
          `/api/admin/registrations?${params.toString()}`,
          { token }
        );
        if (!active) return;
        setList(data);
      } catch (err) {
        if (!active) return;
        if (handleAuthError(err)) return;
        setListError((err as Error).message);
      } finally {
        if (active) setListLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [filters, sortBy, sortDir, page, limit, token, handleAuthError]);

  // debounce text filters (search + district) — modify state via local input then commit
  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const refreshAfterMutation = useCallback(async () => {
    try {
      const [s, l] = await Promise.all([
        apiJson<StatsResponse>('/api/admin/registrations/stats', { token }),
        apiJson<ListResponse>(
          `/api/admin/registrations?${new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            sortDir,
            ...Object.fromEntries(
              Object.entries(filters).filter(([, v]) => Boolean(v))
            ),
          }).toString()}`,
          { token }
        ),
      ]);
      setStats(s);
      setList(l);
    } catch (err) {
      if (!handleAuthError(err)) onToast((err as Error).message, 'error');
    }
  }, [token, page, limit, sortBy, sortDir, filters, handleAuthError, onToast]);

  // open detail
  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await apiJson<Registration>(`/api/admin/registrations/${detailId}`, { token });
        if (active) setDetail(data);
      } catch (err) {
        if (active) {
          if (!handleAuthError(err)) onToast((err as Error).message, 'error');
          setDetailId(null);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [detailId, token, handleAuthError, onToast]);

  const onColumnSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSortBy('createdAt');
    setSortDir('desc');
    setLimit(20);
    setPage(1);
  };

  const onDelete = async () => {
    if (!detail) return;
    if (!window.confirm(`Delete registration for ${detail.fullName}? This cannot be undone.`)) {
      return;
    }
    try {
      await apiJson(`/api/admin/registrations/${detail._id}`, { method: 'DELETE', token });
      onToast('Registration deleted', 'success');
      setDetailId(null);
      await refreshAfterMutation();
    } catch (err) {
      if (!handleAuthError(err)) onToast((err as Error).message, 'error');
    }
  };

  const onExport = async () => {
    try {
      const res = await apiRequest('/api/admin/registrations/export', { token });
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wes-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      onToast((err as Error).message, 'error');
    }
  };

  const totalPages = list?.pages ?? 1;

  return (
    <section>
      <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="admin-display text-xl font-bold tracking-tight">WES Admin</div>
            <div className="text-xs text-white/50">Registration Dashboard</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onExport} className="pill pill-outline text-sm hidden md:inline-flex">
              Export CSV
            </button>
            <button onClick={onLogout} className="pill pill-outline text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StatsGrid stats={stats} />

        <FiltersBar
          filters={filters}
          onFilterChange={setFilter}
          options={options}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortByChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
          onSortDirChange={(v) => {
            setSortDir(v);
            setPage(1);
          }}
          limit={limit}
          onLimitChange={(v) => {
            setLimit(v);
            setPage(1);
          }}
          resultCount={list?.total ?? null}
          onReset={resetFilters}
        />

        <DataTable
          items={list?.items ?? []}
          loading={listLoading}
          error={listError}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onColumnSort}
          onView={(id) => setDetailId(id)}
          page={list?.page ?? page}
          pages={totalPages}
          total={list?.total ?? 0}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </main>

      {detailId && (
        <DetailModal
          detail={detail}
          onClose={() => setDetailId(null)}
          onDelete={onDelete}
        />
      )}
    </section>
  );
}

/* ----------------- STATS ----------------- */

function StatsGrid({ stats }: { stats: StatsResponse | null }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass p-5">
        <div className="text-xs uppercase tracking-wider text-white/50">Total</div>
        <div className="admin-display text-3xl font-bold mt-2">{stats?.total ?? '—'}</div>
      </div>
      <div className="glass p-5">
        <div className="text-xs uppercase tracking-wider text-white/50">Top Industry</div>
        <div className="admin-display text-lg font-semibold mt-2">
          {stats?.byIndustry?.[0]?._id || '—'}
        </div>
      </div>
      <div className="glass p-5">
        <div className="text-xs uppercase tracking-wider text-white/50">Top Stage</div>
        <div className="admin-display text-lg font-semibold mt-2">
          {stats?.byStage?.[0]?._id || '—'}
        </div>
      </div>
      <div className="glass p-5">
        <div className="text-xs uppercase tracking-wider text-white/50">Top Scale</div>
        <div className="admin-display text-lg font-semibold mt-2">
          {stats?.byScale?.[0]?._id || '—'}
        </div>
      </div>
    </div>
  );
}

/* ----------------- FILTERS ----------------- */

function FiltersBar({
  filters,
  onFilterChange,
  options,
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
  limit,
  onLimitChange,
  resultCount,
  onReset,
}: {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  options: OptionsResponse;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortByChange: (v: string) => void;
  onSortDirChange: (v: 'asc' | 'desc') => void;
  limit: number;
  onLimitChange: (v: number) => void;
  resultCount: number | null;
  onReset: () => void;
}) {
  // local state for debounced text inputs
  const [search, setSearch] = useState(filters.search);
  const [district, setDistrict] = useState(filters.district);

  // sync from outside (e.g. on reset)
  useEffect(() => setSearch(filters.search), [filters.search]);
  useEffect(() => setDistrict(filters.district), [filters.district]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (search !== filters.search) onFilterChange('search', search);
    }, 250);
    return () => window.clearTimeout(t);
  }, [search, filters.search, onFilterChange]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (district !== filters.district) onFilterChange('district', district);
    }, 250);
    return () => window.clearTimeout(t);
  }, [district, filters.district, onFilterChange]);

  return (
    <div className="glass p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Search
          </label>
          <input
            className="input"
            placeholder="Name, email, phone, district, business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Industry
          </label>
          <select
            className="input"
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
          >
            <option value="">All</option>
            {options.industry.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Stage
          </label>
          <select
            className="input"
            value={filters.businessStage}
            onChange={(e) => onFilterChange('businessStage', e.target.value)}
          >
            <option value="">All</option>
            {options.businessStage.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Scale
          </label>
          <select
            className="input"
            value={filters.businessScale}
            onChange={(e) => onFilterChange('businessScale', e.target.value)}
          >
            <option value="">All</option>
            {options.businessScale.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            District
          </label>
          <input
            className="input"
            placeholder="Any"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Sort by
          </label>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            {SORT_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Direction
          </label>
          <select
            className="input"
            value={sortDir}
            onChange={(e) => onSortDirChange(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-1.5">
            Per page
          </label>
          <select
            className="input"
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value, 10) || 20)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="md:col-span-5 flex items-end gap-3">
          <button onClick={onReset} className="pill pill-outline text-sm">
            Reset
          </button>
          <div className="text-sm text-white/50 self-center">
            {resultCount !== null && `${resultCount} result${resultCount === 1 ? '' : 's'}`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- TABLE ----------------- */

function DataTable({
  items,
  loading,
  error,
  sortBy,
  sortDir,
  onSort,
  onView,
  page,
  pages,
  total,
  onPrev,
  onNext,
}: {
  items: Registration[];
  loading: boolean;
  error: string | null;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  onView: (id: string) => void;
  page: number;
  pages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const headers: { sort?: string; label: string }[] = useMemo(
    () => [
      { sort: 'fullName', label: 'Full Name' },
      { sort: 'age', label: 'Age' },
      { label: 'Contact' },
      { sort: 'district', label: 'District' },
      { label: 'Venture' },
      { sort: 'industry', label: 'Industry' },
      { sort: 'businessStage', label: 'Stage' },
      { sort: 'businessScale', label: 'Scale' },
      { sort: 'createdAt', label: 'Submitted' },
      { label: '' },
    ],
    []
  );

  const arrowFor = (field?: string) => {
    if (!field) return '';
    if (field !== sortBy) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="glass overflow-hidden">
      <div className="scroll-x">
        <table className="data">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={h.sort && h.sort === sortBy ? 'active' : ''}
                  onClick={h.sort ? () => onSort(h.sort!) : undefined}
                  style={{ cursor: h.sort ? 'pointer' : 'default' }}
                >
                  {h.label}
                  {h.sort && <span className="arrow"> {arrowFor(h.sort)}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-white/50">
                  <span className="spinner" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-red-300">
                  {error}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-white/50">
                  No registrations match these filters.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it._id}>
                  <td className="font-medium">{it.fullName || ''}</td>
                  <td>{it.age ?? ''}</td>
                  <td>
                    <div>{it.email || ''}</div>
                    <div className="text-white/50 text-xs mt-0.5">{it.whatsappNumber || ''}</div>
                  </td>
                  <td>{it.district || ''}</td>
                  <td>
                    <div className="max-w-[200px] truncate">{it.ventureName || ''}</div>
                  </td>
                  <td>
                    <span className="badge">{it.industry || ''}</span>
                  </td>
                  <td>
                    <span className="badge">{it.businessStage || ''}</span>
                  </td>
                  <td>
                    <span className="badge">{it.businessScale || ''}</span>
                  </td>
                  <td className="text-white/70 text-xs">{formatDate(it.createdAt)}</td>
                  <td>
                    <button
                      className="pill pill-outline text-xs"
                      onClick={() => onView(it._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
        <div className="text-sm text-white/50">
          {pages > 0 ? `Page ${page} of ${pages} · ${total} total` : '—'}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} disabled={page <= 1} className="pill pill-outline text-sm">
            Previous
          </button>
          <button onClick={onNext} disabled={page >= pages} className="pill pill-outline text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- DETAIL MODAL ----------------- */

function DetailModal({
  detail,
  onClose,
  onDelete,
}: {
  detail: Registration | null;
  onClose: () => void;
  onDelete: () => void;
}) {
  const fields: [string, unknown][] = detail
    ? [
        ['Age', detail.age],
        ['WhatsApp', detail.whatsappNumber],
        ['Email', detail.email],
        ['District', detail.district],
        ['GPay', detail.gpay],
        ['Venture / Business', detail.ventureName],
        ['Industry / Sector', detail.industry],
        ['Business Stage', detail.businessStage],
        ['Business Scale', detail.businessScale],
        ['Submitted At', formatDate(detail.createdAt, true)],
      ]
    : [];

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-strong max-w-2xl w-[92%] max-h-[88vh] overflow-y-auto p-7">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/50">Registration</div>
            <div className="admin-display text-2xl font-bold">
              {detail?.fullName || (detail ? '—' : '')}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {!detail ? (
          <div className="py-10 text-center text-white/50">
            <span className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {fields.map(([label, val]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
                <div className="mt-1 break-words">
                  {val === null || val === undefined || val === '' ? '—' : String(val)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onDelete} className="pill pill-outline pill-danger text-sm">
            Delete
          </button>
          <button onClick={onClose} className="pill pill-primary text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
