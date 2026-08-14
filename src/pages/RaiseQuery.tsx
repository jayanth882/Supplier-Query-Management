import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import QueryForm from '../components/queries/QueryForm';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function RaiseQuery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSupplier = searchParams.get('supplier') || undefined;
  const { getSupplier } = useApp();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedQueryId, setSubmittedQueryId] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState('');

  const handleSuccess = (query: any) => {
    const supplier = getSupplier(query.supplierId);
    setSupplierName(supplier?.name || 'the supplier');
    setSubmittedQueryId(query.id);
    setShowSuccess(true);
    
    // Auto navigate after 5s
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  return (
    <PageTransition className="min-h-screen pt-24 pb-16 px-4 md:px-6 relative flex flex-col">
      <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors self-start"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <QueryForm 
                preselectedSupplierId={preselectedSupplier} 
                onSuccess={handleSuccess} 
                onCancel={() => navigate('/')}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-emerald/20 flex items-center justify-center mb-8"
              >
                <CheckCircle2 size={48} className="text-emerald" />
              </motion.div>
              
              <h2 className="text-display-md text-white mb-4">Query submitted successfully</h2>
              <p className="text-body-lg text-gray-400 mb-8">
                Your question has been sent to <strong className="text-white">{supplierName}</strong>. You'll receive a notification when they respond.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <button
                  onClick={() => navigate(`/query/${submittedQueryId}`)}
                  className="px-6 py-3 bg-emerald hover:bg-emerald-soft text-white font-semibold rounded-lg transition-colors w-full sm:w-auto"
                >
                  View Query Status
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-charcoal-light hover:bg-charcoal-lighter text-white font-semibold rounded-lg transition-colors border border-border-medium w-full sm:w-auto"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
