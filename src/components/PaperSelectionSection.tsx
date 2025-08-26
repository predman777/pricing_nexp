import React from 'react';
import { JobConfig, PaperStock } from '../types/PricingTypes';

interface PaperSelectionSectionProps {
  jobConfig: JobConfig;
  onUpdate: (updates: Partial<JobConfig>) => void;
  paperStocks: PaperStock[];
}

const PaperSelectionSection: React.FC<PaperSelectionSectionProps> = ({ 
  jobConfig, 
  onUpdate, 
  paperStocks 
}) => {
  const updateQuantity = (size: '8.5x11' | '14x20', type: '4/0' | '4/4', value: number) => {
    const newQuantities = { ...jobConfig.quantities };
    newQuantities[size][type] = value;
    onUpdate({ quantities: newQuantities });
  };

  const selectedPaper = paperStocks.find(p => p.id === jobConfig.selectedPaper);

  // Check if a size is available for the selected paper
  const isSizeAvailable = (size: '8.5x11' | '14x20'): boolean => {
    if (!selectedPaper) return true;
    if (!selectedPaper.availableSizes) return true; // If not specified, assume all sizes available
    return selectedPaper.availableSizes.includes(size);
  };

  // When paper changes, clear quantities for unavailable sizes
  React.useEffect(() => {
    if (selectedPaper) {
      const newQuantities = { ...jobConfig.quantities };
      let hasChanges = false;

      if (!isSizeAvailable('8.5x11')) {
        if (newQuantities['8.5x11']['4/0'] !== 0 || newQuantities['8.5x11']['4/4'] !== 0) {
          newQuantities['8.5x11']['4/0'] = 0;
          newQuantities['8.5x11']['4/4'] = 0;
          hasChanges = true;
        }
      }

      if (!isSizeAvailable('14x20')) {
        if (newQuantities['14x20']['4/0'] !== 0 || newQuantities['14x20']['4/4'] !== 0) {
          newQuantities['14x20']['4/0'] = 0;
          newQuantities['14x20']['4/4'] = 0;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        onUpdate({ quantities: newQuantities });
      }
    }
  }, [jobConfig.selectedPaper]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-darker-blue">
      <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">Paper & Size Selection</h2>
      
      {/* Paper Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Paper Stock
        </label>
        <select
          value={jobConfig.selectedPaper}
          onChange={(e) => onUpdate({ selectedPaper: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors text-lg"
        >
          {paperStocks.map(paper => (
            <option key={paper.id} value={paper.id}>
              {paper.name} - {paper.manufacturer}
            </option>
          ))}
        </select>
        
        {selectedPaper && (
          <div className="mt-3 p-3 bg-brand-pale-gold rounded-lg border border-brand-gold">
            <p className="text-sm text-brand-orange font-semibold">
              Pricing: 8.5"x11" = ${selectedPaper.prices['8.5x11'].toFixed(3)} | 
              14"x20" = ${selectedPaper.prices['14x20'].toFixed(3)}
            </p>
          </div>
        )}
      </div>

      {/* Quantity Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-indigo text-white">
              <th className="border border-gray-300 px-4 py-3 text-left font-display">Sheets</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-display" colSpan={2}>
                8.5"x11"
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-display" colSpan={2}>
                14"x20"
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-display">Totals</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2"></th>
              <th className="border border-gray-300 px-4 py-2 text-sm">Quantity @ 4/0</th>
              <th className="border border-gray-300 px-4 py-2 text-sm">Quantity @ 4/4</th>
              <th className="border border-gray-300 px-4 py-2 text-sm">Quantity @ 4/0</th>
              <th className="border border-gray-300 px-4 py-2 text-sm">Quantity @ 4/4</th>
              <th className="border border-gray-300 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-3 font-semibold bg-gray-50">
                {selectedPaper?.name || 'Select Paper'}
              </td>
              <td className={`border border-gray-300 px-2 py-2 ${!isSizeAvailable('8.5x11') ? 'bg-gray-200' : ''}`}>
                <input
                  type="number"
                  value={jobConfig.quantities['8.5x11']['4/0']}
                  onChange={(e) => updateQuantity('8.5x11', '4/0', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border-2 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold ${
                    !isSizeAvailable('8.5x11') 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                      : 'border-gray-300 bg-white'
                  }`}
                  min="0"
                  disabled={!isSizeAvailable('8.5x11')}
                />
              </td>
              <td className={`border border-gray-300 px-2 py-2 ${!isSizeAvailable('8.5x11') ? 'bg-gray-200' : ''}`}>
                <input
                  type="number"
                  value={jobConfig.quantities['8.5x11']['4/4']}
                  onChange={(e) => updateQuantity('8.5x11', '4/4', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border-2 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold ${
                    !isSizeAvailable('8.5x11') 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                      : 'border-gray-300 bg-white'
                  }`}
                  min="0"
                  disabled={!isSizeAvailable('8.5x11')}
                />
              </td>
              <td className={`border border-gray-300 px-2 py-2 ${!isSizeAvailable('14x20') ? 'bg-gray-200' : ''}`}>
                <input
                  type="number"
                  value={jobConfig.quantities['14x20']['4/0']}
                  onChange={(e) => updateQuantity('14x20', '4/0', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border-2 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold ${
                    !isSizeAvailable('14x20') 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                      : 'border-gray-300 bg-white'
                  }`}
                  min="0"
                  disabled={!isSizeAvailable('14x20')}
                />
              </td>
              <td className={`border border-gray-300 px-2 py-2 ${!isSizeAvailable('14x20') ? 'bg-gray-200' : ''}`}>
                <input
                  type="number"
                  value={jobConfig.quantities['14x20']['4/4']}
                  onChange={(e) => updateQuantity('14x20', '4/4', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border-2 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold ${
                    !isSizeAvailable('14x20') 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
                      : 'border-gray-300 bg-white'
                  }`}
                  min="0"
                  disabled={!isSizeAvailable('14x20')}
                />
              </td>
              <td className="border border-gray-300 px-4 py-3 font-bold text-center bg-brand-pale-blue">
                {jobConfig.quantities['8.5x11']['4/0'] + 
                 jobConfig.quantities['8.5x11']['4/4'] + 
                 jobConfig.quantities['14x20']['4/0'] + 
                 jobConfig.quantities['14x20']['4/4']}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Protective Cost Rules */}
      <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">📋 Protective Cost Rules:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 4/0: Takes into account proof sheets</li>
          <li>• 4/4: Takes into account cleaner and proof sheets</li>
          <li>• 30 cards per 11"x17" sheet</li>
          <li>• Enter 50% in % coverage box for full coverage 1 side</li>
        </ul>
      </div>

      {/* Business Cards Quick Selection */}
      <div className="mt-6 p-4 bg-brand-pale-gold rounded-lg border-2 border-brand-gold">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="enableBusinessCards"
            checked={jobConfig.businessCards.quantity > 0}
            onChange={(e) => {
              if (e.target.checked) {
                onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    quantity: 1000,
                    perSheet: 30
                  }
                });
              } else {
                onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    quantity: 0
                  }
                });
              }
            }}
            className="w-5 h-5 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold mr-3"
          />
          <label htmlFor="enableBusinessCards" className="text-lg font-bold text-brand-indigo cursor-pointer">
            📄 Business Cards
          </label>
        </div>
        
        {jobConfig.businessCards.quantity > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cards per sheet
              </label>
              <input
                type="number"
                value={jobConfig.businessCards.perSheet}
                onChange={(e) => onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    perSheet: parseInt(e.target.value) || 0 
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                12Pt / 111# Top Coat
              </label>
              <select
                value={jobConfig.businessCards.topCoat ? "1" : "0"}
                onChange={(e) => onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    topCoat: e.target.value === "1" 
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sides glossed
              </label>
              <select
                value={jobConfig.businessCards.sidesGlossed}
                onChange={(e) => onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    sidesGlossed: parseInt(e.target.value) 
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value={0}>0</option>
                <option value={1}>1 side @ $65.00 / 1000 cards</option>
                <option value={2}>2 sides @ $95.00 / 1000 cards</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={jobConfig.businessCards.quantity}
                onChange={(e) => onUpdate({ 
                  businessCards: { 
                    ...jobConfig.businessCards, 
                    quantity: parseInt(e.target.value) || 0 
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                min="0"
                step="100"
                placeholder="Number of cards"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperSelectionSection;
