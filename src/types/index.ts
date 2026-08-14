export type QueryStatus = 'Pending' | 'In Progress' | 'Resolved';
export type QueryPriority = 'Low' | 'Medium' | 'High';
export type QueryCategory =
  | 'Allergen Information'
  | 'Certification'
  | 'Ingredient Safety'
  | 'Documentation'
  | 'Contamination'
  | 'Product Compliance';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  contactEmail: string;
  activeQueries: number;
  resolvedQueries: number;
  responseRate: number;
  lastResponse: string;
  status: 'Active' | 'Under Review' | 'Suspended';
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  status: 'completed' | 'active' | 'upcoming';
  description?: string;
}

export interface Query {
  id: string;
  supplierId: string;
  supplierName: string;
  subject: string;
  description: string;
  category: QueryCategory;
  priority: QueryPriority;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  timeline: TimelineEvent[];
}

export interface NewQueryForm {
  supplierId: string;
  queryType: QueryCategory;
  subject: string;
  description: string;
  priority: QueryPriority;
  dueDate?: string;
}

export interface FilterState {
  search: string;
  status: QueryStatus | 'All';
  category: QueryCategory | 'All';
  sortBy: 'newest' | 'oldest' | 'priority' | 'supplier';
}

export interface MonthlyData {
  month: string;
  queries: number;
}
