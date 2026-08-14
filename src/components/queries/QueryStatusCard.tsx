import type { Query } from '../../types';
import { useApp } from '../../context/AppContext';
import { getTimeAgo } from '../../utils/formatters';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QueryStatusCardProps {
  query: Query;
}

export default function QueryStatusCard({ query }: QueryStatusCardProps) {
  const { getSupplier } = useApp();
  const navigate = useNavigate();
  const supplier = getSupplier(query.supplierId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-pending bg-amber-pending/10 border-amber-pending/30';
      case 'In Progress': return 'text-blue-progress bg-blue-progress/10 border-blue-progress/30';
      case 'Resolved': return 'text-green-resolved bg-green-resolved/10 border-green-resolved/30';
      default: return 'text-gray-400 bg-gray-800 border-gray-600';
    }
  };

  const isActive = query.status !== 'Resolved';

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden border border-border-medium group bg-charcoal-light/30"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(query.status)}`}>
            {isActive && (
              <span className="relative flex h-2 w-2 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${query.status === 'Pending' ? 'bg-amber-pending' : 'bg-blue-progress'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${query.status === 'Pending' ? 'bg-amber-pending' : 'bg-blue-progress'}`}></span>
              </span>
            )}
            {query.status}
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{query.id}</span>
        </div>

        <div className="mb-8 flex-1">
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">{supplier?.name || 'Unknown Supplier'}</h3>
          <p className="text-lg text-cream mb-4 line-clamp-2">{query.subject}</p>
          
          <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock size={16} className="mr-2 opacity-70" />
              <span>Your query was sent {getTimeAgo(query.createdAt)}.</span>
            </div>
            {query.dueDate && (
              <div className="flex items-center text-amber-pending/80">
                <Clock size={16} className="mr-2 opacity-70" />
                <span>Expected response: By {query.dueDate}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle mt-auto">
          <button 
            onClick={() => navigate(`/suppliers/${query.supplierId}`)}
            className="flex items-center text-sm font-semibold text-emerald hover:text-emerald-soft transition-colors"
          >
            View Supplier Details
            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
