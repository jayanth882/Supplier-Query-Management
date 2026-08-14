import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';
import { useApp } from '../context/AppContext';
import QueryStatusCard from '../components/queries/QueryStatusCard';
import Timeline from '../components/timeline/Timeline';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export default function QueryStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuery, getSupplier, updateQueryStatus } = useApp();
  
  const query = getQuery(id || '');
  const supplier = query ? getSupplier(query.supplierId) : null;

  if (!query) {
    return (
      <PageTransition className="min-h-screen pt-32 pb-16 px-4 md:px-6 text-center">
        <h1 className="text-display-md text-white mb-4">Query not found</h1>
        <button onClick={() => navigate('/')} className="text-emerald hover:underline">
          Return to dashboard
        </button>
      </PageTransition>
    );
  }

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'text-red-high';
    if (p === 'Medium') return 'text-amber-pending';
    return 'text-emerald';
  };

  const handleStatusChange = () => {
    if (query.status === 'Pending') {
      updateQueryStatus(query.id, 'In Progress');
    } else if (query.status === 'In Progress') {
      updateQueryStatus(query.id, 'Resolved');
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

        <div className="mb-12">
          <h2 className="text-section-label mb-3">QUERY TRACKING</h2>
          <h1 className="text-display-lg text-white">Query Status</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-8">
            <QueryStatusCard query={query} />

            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border-medium bg-charcoal-deep/50">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-border-subtle pb-4">Query Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Query ID</p>
                  <p className="text-cream font-medium">{query.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Supplier</p>
                  <Link to={`/suppliers/${query.supplierId}`} className="text-emerald hover:text-emerald-soft font-medium flex items-center group">
                    {supplier?.name}
                    <ExternalLink size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-cream">{query.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                  <p className={`font-semibold ${getPriorityColor(query.priority)}`}>{query.priority}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  <div className="bg-charcoal-deep/80 p-4 rounded-lg border border-border-subtle">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{query.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-border-medium bg-charcoal-deep/50 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-8 border-b border-border-subtle pb-4">Timeline</h3>
              
              <div className="flex-1 mb-8">
                <Timeline events={query.timeline} vertical={true} />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-border-subtle mt-auto">
                {query.status !== 'Resolved' ? (
                  <button
                    onClick={handleStatusChange}
                    className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center bg-emerald hover:bg-emerald-soft shadow-emerald/20"
                  >
                    {query.status === 'Pending' ? 'Mark as In Progress' : 'Mark as Resolved'}
                  </button>
                ) : (
                  <div className="flex items-center justify-center p-4 rounded-xl bg-green-resolved/10 border border-green-resolved/30 text-green-resolved">
                    <CheckCircle size={20} className="mr-2" />
                    <span className="font-bold">This query is fully resolved.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
