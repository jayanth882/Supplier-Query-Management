import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, Building, FileText, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSupplier, getQueriesBySupplier } = useApp();
  
  const supplier = getSupplier(id || '');
  const queries = getQueriesBySupplier(id || '');

  if (!supplier) {
    return (
      <PageTransition className="min-h-screen pt-32 pb-16 px-4 md:px-6 text-center">
        <h1 className="text-display-md text-white mb-4">Supplier not found</h1>
        <button onClick={() => navigate('/')} className="text-emerald hover:underline">
          Return to dashboard
        </button>
      </PageTransition>
    );
  }

  const activeQueries = queries.filter(q => q.status !== 'Resolved');
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-pending border-amber-pending/30';
      case 'In Progress': return 'text-blue-progress border-blue-progress/30';
      case 'Resolved': return 'text-green-resolved border-green-resolved/30';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  return (
    <PageTransition className="min-h-screen pt-24 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-gray-400 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-emerald/10 border border-emerald/30 text-emerald rounded-full text-xs font-bold uppercase tracking-wider">
                {supplier.status}
              </span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{supplier.category}</span>
            </div>
            <h1 className="text-display-lg text-white mb-2">{supplier.name}</h1>
          </div>
          
          <button
            onClick={() => navigate(`/raise-query?supplier=${supplier.id}`)}
            className="px-6 py-3 bg-white text-charcoal-deep font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg self-start md:self-auto"
          >
            Raise New Query
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="glass-card p-6 rounded-2xl border border-border-medium">
            <div className="flex items-center text-gray-400 mb-2">
              <Building size={16} className="mr-2" />
              <span className="text-xs uppercase tracking-wider font-medium">Supplier ID</span>
            </div>
            <p className="text-lg font-medium text-white">{supplier.id}</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-border-medium">
            <div className="flex items-center text-gray-400 mb-2">
              <MapPin size={16} className="mr-2" />
              <span className="text-xs uppercase tracking-wider font-medium">Location</span>
            </div>
            <p className="text-lg font-medium text-white">{supplier.location}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border-medium">
            <div className="flex items-center text-gray-400 mb-2">
              <CheckCircle size={16} className="mr-2" />
              <span className="text-xs uppercase tracking-wider font-medium">Response Rate</span>
            </div>
            <p className="text-lg font-medium text-white">{supplier.responseRate}%</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border-medium">
            <div className="flex items-center text-gray-400 mb-2">
              <Clock size={16} className="mr-2" />
              <span className="text-xs uppercase tracking-wider font-medium">Last Response</span>
            </div>
            <p className="text-lg font-medium text-white">{supplier.lastResponse ? formatDate(supplier.lastResponse) : 'N/A'}</p>
          </div>
        </div>

        {/* Active Queries Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-border-medium pb-4">
            <h2 className="text-2xl font-display font-bold text-white flex items-center">
              Active Queries 
              <span className="ml-3 px-2.5 py-0.5 rounded-full bg-charcoal-light border border-border-subtle text-sm text-gray-300">
                {activeQueries.length}
              </span>
            </h2>
          </div>

          {activeQueries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeQueries.map(query => (
                <Link 
                  key={query.id} 
                  to={`/query/${query.id}`}
                  className="glass-card p-6 rounded-2xl border border-border-medium hover:border-emerald/50 transition-colors group block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald/10 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border bg-charcoal-deep ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{formatDate(query.createdAt)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald transition-colors relative z-10">{query.subject}</h3>
                  <div className="flex items-center text-sm text-gray-400 space-x-4 relative z-10">
                    <span className="flex items-center"><FileText size={14} className="mr-1.5 opacity-70" /> {query.category}</span>
                    <span className="text-border-subtle">|</span>
                    <span className={`font-medium ${query.priority === 'High' ? 'text-red-high' : query.priority === 'Medium' ? 'text-amber-pending' : 'text-emerald'}`}>
                      {query.priority} Priority
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-dashed border-border-medium rounded-2xl text-center">
              <p className="text-gray-400 font-medium">No active queries for this supplier.</p>
            </div>
          )}
        </div>

        {/* Resolved Queries Summary */}
        {resolvedQueries.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-400 mb-6">Past Resolutions ({resolvedQueries.length})</h3>
            <div className="space-y-3">
              {resolvedQueries.slice(0, 3).map(query => (
                <Link key={query.id} to={`/query/${query.id}`} className="flex items-center justify-between p-4 rounded-xl bg-charcoal-deep/50 border border-border-subtle hover:bg-charcoal-light/50 transition-colors">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-green-resolved mr-3" />
                    <span className="text-cream font-medium text-sm">{query.subject}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(query.updatedAt)}</span>
                </Link>
              ))}
              {resolvedQueries.length > 3 && (
                <div className="p-4 text-center">
                  <span className="text-sm text-emerald cursor-pointer hover:underline">View all {resolvedQueries.length} resolved queries</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
