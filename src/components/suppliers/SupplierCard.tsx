import type { Supplier } from '../../types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SupplierCardProps {
  supplier: Supplier;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => navigate(`/suppliers/${supplier.id}`)}
      className="glass-card flex-shrink-0 w-72 md:w-80 rounded-2xl p-6 cursor-pointer border border-border-subtle hover:border-border-medium relative overflow-hidden group"
    >
      {/* Accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-body-lg font-bold text-off-white font-body truncate max-w-[180px]">{supplier.name}</h3>
          <p className="text-body text-cream/60 font-body text-sm mt-1">{supplier.category}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${supplier.status === 'Active' ? 'bg-emerald-glow text-emerald' : 'bg-border-subtle text-cream/70'}`}>
          {supplier.status}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-cream/50 flex items-center gap-1 font-body">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {supplier.location || 'Unknown Location'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4">
        <div>
          <p className="text-xs text-cream/50 mb-1 font-body uppercase tracking-wider">Response Rate</p>
          <p className="text-lg text-emerald font-display font-semibold">{supplier.responseRate}%</p>
        </div>
        <div>
          <p className="text-xs text-cream/50 mb-1 font-body uppercase tracking-wider">Last Response</p>
          <p className="text-lg text-cream/80 font-display font-semibold">{supplier.lastResponse}</p>
        </div>
      </div>
    </motion.div>
  );
};
