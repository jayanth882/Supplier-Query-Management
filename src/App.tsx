import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnimatePresence } from 'framer-motion';

import { LoadingScreen } from './components/ui/LoadingScreen';
import { CustomCursor } from './components/hero/CustomCursor';
import Navbar from './components/layout/Navbar';

import Dashboard from './pages/Dashboard';
import RaiseQuery from './pages/RaiseQuery';
import QueryStatus from './pages/QueryStatus';
import SupplierDetailPage from './pages/SupplierDetailPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/raise-query" element={<RaiseQuery />} />
        <Route path="/query/:id" element={<QueryStatus />} />
        <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppProvider>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <BrowserRouter>
          <div className="noise-overlay pointer-events-none fixed inset-0 z-50 opacity-20"></div>
          
          <div className="hidden lg:block">
            <CustomCursor />
          </div>
          
          <div className="min-h-screen bg-charcoal font-body text-off-white selection:bg-emerald/30 selection:text-white">
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
          </div>
        </BrowserRouter>
      )}
    </AppProvider>
  );
}

export default App;
