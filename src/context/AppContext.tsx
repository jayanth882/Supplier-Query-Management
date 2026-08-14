import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { suppliers as initialSuppliers, queries as initialQueries } from '../data/mockData';
import type { Supplier, Query, FilterState, NewQueryForm, QueryStatus, TimelineEvent } from '../types';

interface AppContextType {
  suppliers: Supplier[];
  queries: Query[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addQuery: (form: NewQueryForm) => Query;
  updateQueryStatus: (queryId: string, status: QueryStatus) => void;
  getSupplier: (id: string) => Supplier | undefined;
  getQuery: (id: string) => Query | undefined;
  getQueriesBySupplier: (supplierId: string) => Query[];
  stats: {
    totalSuppliers: number;
    openQueries: number;
    awaitingResponse: number;
    resolved: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [queries, setQueries] = useState<Query[]>(initialQueries);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    category: 'All',
    sortBy: 'newest',
  });

  const addQuery = useCallback((form: NewQueryForm): Query => {
    const supplier = suppliers.find(s => s.id === form.supplierId);
    const queryId = `QRY-${1000 + queries.length + 1}`;
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true 
    });

    const timeline: TimelineEvent[] = [
      { id: 'tl-1', label: 'Query Created', timestamp: timeStr, status: 'completed', description: 'Query raised by QA Manager' },
      { id: 'tl-2', label: 'Sent to Supplier', timestamp: timeStr, status: 'completed', description: `Notification sent to ${supplier?.name || 'Supplier'}` },
      { id: 'tl-3', label: 'Awaiting Supplier Response', timestamp: 'Current stage', status: 'active', description: 'Waiting for supplier to respond' },
      { id: 'tl-4', label: 'Response Received', timestamp: '', status: 'upcoming' },
      { id: 'tl-5', label: 'Query Resolved', timestamp: '', status: 'upcoming' },
    ];

    const newQuery: Query = {
      id: queryId,
      supplierId: form.supplierId,
      supplierName: supplier?.name || 'Unknown Supplier',
      subject: form.subject,
      description: form.description,
      category: form.queryType,
      priority: form.priority,
      status: 'Pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueDate: form.dueDate,
      timeline,
    };

    setQueries(prev => [newQuery, ...prev]);
    return newQuery;
  }, [suppliers, queries.length]);

  const updateQueryStatus = useCallback((queryId: string, status: QueryStatus) => {
    setQueries(prev => prev.map(q => {
      if (q.id !== queryId) return q;
      
      const now = new Date();
      const timeStr = now.toLocaleString('en-US', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true 
      });

      let updatedTimeline = [...q.timeline];
      
      if (status === 'In Progress') {
        updatedTimeline = updatedTimeline.map(t => {
          if (t.label === 'Awaiting Supplier Response') return { ...t, status: 'completed' as const, timestamp: timeStr };
          if (t.label === 'Response Received') return { ...t, status: 'active' as const, timestamp: timeStr, description: 'Response under review' };
          return t;
        });
      } else if (status === 'Resolved') {
        updatedTimeline = updatedTimeline.map(t => {
          if (t.status === 'upcoming' || t.status === 'active') {
            return { ...t, status: 'completed' as const, timestamp: t.timestamp || timeStr };
          }
          return t;
        });
      }

      return {
        ...q,
        status,
        updatedAt: now.toISOString(),
        timeline: updatedTimeline,
      };
    }));
  }, []);

  const getSupplier = useCallback((id: string) => suppliers.find(s => s.id === id), [suppliers]);
  const getQuery = useCallback((id: string) => queries.find(q => q.id === id), [queries]);
  const getQueriesBySupplier = useCallback((supplierId: string) => queries.filter(q => q.supplierId === supplierId), [queries]);

  const stats = {
    totalSuppliers: suppliers.length,
    openQueries: queries.filter(q => q.status !== 'Resolved').length,
    awaitingResponse: queries.filter(q => q.status === 'Pending').length,
    resolved: queries.filter(q => q.status === 'Resolved').length,
  };

  return (
    <AppContext.Provider value={{
      suppliers,
      queries,
      filters,
      setFilters,
      addQuery,
      updateQueryStatus,
      getSupplier,
      getQuery,
      getQueriesBySupplier,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
