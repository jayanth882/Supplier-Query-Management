import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { getTimeAgo } from '../../utils/formatters';
import { ChevronRight } from 'lucide-react';

export const SupplierTable: React.FC = () => {
  const { queries, filters, setFilters, suppliers } = useApp();
  const navigate = useNavigate();

  const filteredQueries = useMemo(() => {
    let result = queries.filter(query => {
      // Status filter
      if (filters.status && filters.status !== 'All' && query.status !== filters.status) {
        return false;
      }
      
      // Category filter
      if (filters.category && filters.category !== 'All' && query.category !== filters.category) {
        return false;
      }
      
      // Search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const supplier = suppliers.find(s => s.id === query.supplierId);
        const supplierNameMatch = supplier?.name.toLowerCase().includes(searchLower) || false;
        const subjectMatch = query.subject.toLowerCase().includes(searchLower);
        
        if (!supplierNameMatch && !subjectMatch) {
          return false;
        }
      }
      
      return true;
    });

    // Apply sorting
    if (filters.sortBy) {
      result = [...result].sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (filters.sortBy === 'oldest') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        } else if (filters.sortBy === 'priority') {
          const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityWeight[b.priority as keyof typeof priorityWeight] - priorityWeight[a.priority as keyof typeof priorityWeight];
        } else if (filters.sortBy === 'supplier') {
          const supA = suppliers.find(s => s.id === a.supplierId)?.name || '';
          const supB = suppliers.find(s => s.id === b.supplierId)?.name || '';
          return supA.localeCompare(supB);
        }
        return 0;
      });
    }

    return result;
  }, [queries, filters, suppliers]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-[#e85454]';
      case 'Medium': return 'text-amber-pending';
      case 'Low': return 'text-emerald';
      default: return 'text-cream';
    }
  };

  return (
    <section id="supplier-queries" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-display-md text-off-white font-display mb-2">Supplier Queries</h2>
        <p className="text-body text-cream/70 font-body">Monitor every food-safety conversation from one place.</p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <div className="mt-8 glass-card rounded-2xl border border-border-subtle overflow-hidden overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-border-subtle bg-charcoal-light/50 text-xs font-semibold text-cream/60 uppercase tracking-wider font-body">
            <div className="col-span-3">Supplier</div>
            <div className="col-span-3">Query</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status & Priority</div>
            <div className="col-span-1">Updated</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Body / Mobile Cards */}
          <div className="divide-y divide-border-subtle">
            <AnimatePresence>
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query, index) => {
                  const supplier = suppliers.find(s => s.id === query.supplierId);
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={query.id}
                      onClick={() => navigate(`/query/${query.id}`)}
                      className="group relative cursor-pointer hover:bg-white/[0.02] transition-colors p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-4"
                    >
                      {/* Hover left accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Supplier */}
                      <div className="md:col-span-3 flex flex-col">
                        <span className="font-bold text-off-white font-body truncate">{supplier?.name || 'Unknown Supplier'}</span>
                        <span className="text-xs text-cream/50 mt-1 truncate">{supplier?.category || ''}</span>
                      </div>

                      {/* Query Subject */}
                      <div className="md:col-span-3 text-body text-cream/90 font-body truncate font-medium">
                        {query.subject}
                      </div>

                      {/* Category */}
                      <div className="md:col-span-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs bg-charcoal-lighter text-cream/70 border border-border-subtle">
                          {query.category}
                        </span>
                      </div>

                      {/* Status & Priority */}
                      <div className="md:col-span-2 flex flex-row md:flex-col gap-3 md:gap-1 items-center md:items-start justify-between md:justify-start">
                        <StatusBadge status={query.status} />
                        <span className={`text-xs font-semibold ${getPriorityColor(query.priority)}`}>
                          {query.priority} Priority
                        </span>
                      </div>

                      {/* Updated */}
                      <div className="md:col-span-1 text-xs text-cream/50 flex items-center justify-between md:block">
                        <span className="md:hidden">Last Updated:</span>
                        {getTimeAgo(query.updatedAt)}
                      </div>

                      {/* Action */}
                      <div className="md:col-span-1 flex justify-end items-center">
                        <div className="hidden md:flex items-center gap-1 text-sm text-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold hover:text-emerald-soft">
                          View <ChevronRight size={16} />
                        </div>
                        <div className="md:hidden w-full text-center py-2 mt-2 rounded-lg bg-border-subtle text-cream text-sm font-semibold hover:bg-border-medium transition-colors">
                          View Details
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-12 text-center text-cream/60 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-border-subtle flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <p className="text-body-lg font-display text-off-white mb-2">No queries found</p>
                  <p className="text-body text-cream/50 max-w-md">We couldn't find any queries matching your current filters. Try adjusting your search or clearing some filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
