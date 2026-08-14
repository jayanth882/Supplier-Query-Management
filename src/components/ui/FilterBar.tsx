import React from 'react';
import { Search } from 'lucide-react';
import type { FilterState } from '../../types';

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value as FilterState['status'] });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value as FilterState['category'] });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] });
  };

  return (
    <div className="glass p-4 rounded-xl border border-border-subtle flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="relative w-full md:w-auto md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(245,242,235,0.4)] pointer-events-none" />
        <input
          type="text"
          placeholder="Search queries, suppliers..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="w-full bg-[rgba(0,0,0,0.2)] border border-border-subtle rounded-lg py-2.5 pl-10 pr-4 text-off-white placeholder:text-[rgba(245,242,235,0.4)] focus:outline-none focus:ring-2 focus:ring-emerald transition-all"
        />
      </div>
      
      <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0">
        <select
          value={filters.status || 'All'}
          onChange={handleStatusChange}
          className="bg-[rgba(0,0,0,0.2)] border border-border-subtle rounded-lg px-4 py-2.5 text-off-white focus:outline-none focus:ring-2 focus:ring-emerald appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={filters.category || 'All'}
          onChange={handleCategoryChange}
          className="bg-[rgba(0,0,0,0.2)] border border-border-subtle rounded-lg px-4 py-2.5 text-off-white focus:outline-none focus:ring-2 focus:ring-emerald appearance-none cursor-pointer min-w-[150px]"
        >
          <option value="All">All Categories</option>
          <option value="Allergen Information">Allergen Information</option>
          <option value="Certification">Certification</option>
          <option value="Ingredient Safety">Ingredient Safety</option>
          <option value="Documentation">Documentation</option>
          <option value="Contamination">Contamination</option>
          <option value="Product Compliance">Product Compliance</option>
        </select>

        <select
          value={filters.sortBy || 'newest'}
          onChange={handleSortChange}
          className="bg-[rgba(0,0,0,0.2)] border border-border-subtle rounded-lg px-4 py-2.5 text-off-white focus:outline-none focus:ring-2 focus:ring-emerald appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>
    </div>
  );
};
