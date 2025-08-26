import React, { useState } from 'react';
import PricingCalculator from './components/PricingCalculator';
import AdminPanel from './components/AdminPanel';
import { usePricingData } from './hooks/usePricingData';

function App() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const pricingData = usePricingData();

  const handleAdminSave = (data: any) => {
    pricingData.updatePricingData(data);
    setShowAdminPanel(false);
    // Reload the page to apply new pricing
    window.location.reload();
  };

  // Keyboard shortcut for admin panel (Ctrl/Cmd + Shift + A)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="App">
      <PricingCalculator pricingData={pricingData} />
      
      {/* Admin Button - positioned at top right for better visibility */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed top-20 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-50 flex items-center space-x-2 font-bold"
        title="Admin Panel (Ctrl+Shift+A)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Admin Panel</span>
      </button>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          onSave={handleAdminSave}
        />
      )}
    </div>
  );
}

export default App;
