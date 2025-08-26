import React from 'react';
import { CalculationResults, JobConfig } from '../types/PricingTypes';

interface CalculationResultsSectionProps {
  results: CalculationResults | null;
  jobConfig: JobConfig;
  onUpdate: (updates: Partial<JobConfig>) => void;
}

const CalculationResultsSection: React.FC<CalculationResultsSectionProps> = ({ 
  results, 
  jobConfig,
  onUpdate 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Show greyed-out layout when no results
  if (!results) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl shadow-2xl p-6 border-2 border-gray-400 opacity-60">
        <h2 className="text-2xl font-bold text-white mb-6 font-display flex items-center">
          💰 Calculation Results
          <span className="ml-3 text-sm text-gray-200 font-normal">(Enter quantities to calculate)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Greyed Cost Breakdown */}
          <div className="bg-white/70 backdrop-blur rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-500 mb-4 border-b-2 border-gray-300 pb-2">
              Cost Breakdown
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Paper Cost:</span>
                <span className="font-semibold text-gray-400">$0.00</span>
              </div>
              
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Protective Coating:</span>
                <span className="font-semibold text-gray-400">$0.00</span>
              </div>
              
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Consumables:</span>
                <span className="font-semibold text-gray-400">$0.00</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-semibold">Labor Costs:</span>
                  <span className="font-bold text-gray-400">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-400 text-sm">Pre Press:</span>
                  <span className="text-gray-400 text-sm">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-400 text-sm">Variable Data:</span>
                  <span className="text-gray-400 text-sm">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-400 text-sm">Bindery:</span>
                  <span className="text-gray-400 text-sm">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Greyed Totals and Profit */}
          <div className="space-y-4">
            {/* Greyed Subtotals */}
            <div className="bg-white/70 backdrop-blur rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-500 mb-4 border-b-2 border-gray-300 pb-2">
                Totals
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Sub Total:</span>
                  <span className="font-bold text-lg text-gray-400">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Overhead ({(jobConfig.overheadRate * 100).toFixed(0)}%):</span>
                  <span className="font-bold text-lg text-gray-400">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-gray-500 font-bold">Total Cost:</span>
                  <span className="font-bold text-xl text-gray-400">$0.00</span>
                </div>
              </div>
            </div>

            {/* Active Profit Calculation */}
            <div className="bg-gradient-to-br from-brand-gold to-yellow-400 rounded-lg p-5 border-2 border-white shadow-lg">
              <h3 className="text-lg font-bold text-brand-indigo mb-4">
                Profit Configuration
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-brand-indigo mb-2">
                  Cost + Multiplier (%)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={jobConfig.costMultiplier * 100}
                    onChange={(e) => onUpdate({ costMultiplier: (parseFloat(e.target.value) || 100) / 100 })}
                    className="flex-1 px-3 py-2 border-2 border-brand-indigo rounded focus:ring-2 focus:ring-white focus:border-white font-bold text-center text-lg"
                    min="100"
                    step="5"
                  />
                  <span className="text-lg font-bold text-brand-indigo">%</span>
                </div>
                <p className="text-sm text-brand-indigo mt-1">Values will update when quantities are entered</p>
              </div>
              
              <div className="space-y-3 border-t-2 border-brand-indigo pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-indigo">Profit:</span>
                  <span className="font-bold text-lg text-gray-500">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-indigo">FINAL PRICE:</span>
                  <span className="font-bold text-2xl text-gray-500">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center bg-white/80 rounded p-2">
                  <span className="font-bold text-brand-indigo">Cost Per Piece:</span>
                  <span className="font-bold text-xl text-gray-500">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Greyed Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg shadow cursor-not-allowed opacity-50">
            📄 Export to PDF
          </button>
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg shadow cursor-not-allowed opacity-50">
            💾 Save Quote
          </button>
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg shadow cursor-not-allowed opacity-50">
            📧 Email Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-indigo to-purple-800 rounded-xl shadow-2xl p-6 border-2 border-brand-gold">
      <h2 className="text-2xl font-bold text-white mb-6 font-display">
        💰 Calculation Results
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-white/95 backdrop-blur rounded-lg p-5">
          <h3 className="text-lg font-bold text-brand-indigo mb-4 border-b-2 border-brand-gold pb-2">
            Cost Breakdown
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700">Paper Cost:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0))}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700">Protective Coating:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.protectiveCoatingCost)}</span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700">Consumables:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(results.totalConsumables)}</span>
            </div>
            
            {results.businessCardCosts.total > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Business Cards:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.businessCardCosts.total)}</span>
              </div>
            )}
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-semibold">Labor Costs:</span>
                <span className="font-bold text-brand-indigo">
                  {formatCurrency(
                    Object.values(results.laborCosts).reduce((a, b) => a + b, 0)
                  )}
                </span>
              </div>
              
              {results.laborCosts.prePress > 0 && (
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-600 text-sm">Pre Press:</span>
                  <span className="text-gray-700 text-sm">{formatCurrency(results.laborCosts.prePress)}</span>
                </div>
              )}
              
              {results.laborCosts.variableData > 0 && (
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-600 text-sm">Variable Data:</span>
                  <span className="text-gray-700 text-sm">{formatCurrency(results.laborCosts.variableData)}</span>
                </div>
              )}
              
              {results.laborCosts.bindery > 0 && (
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-600 text-sm">Bindery:</span>
                  <span className="text-gray-700 text-sm">{formatCurrency(results.laborCosts.bindery)}</span>
                </div>
              )}
              
              {results.laborCosts.nexpress > 0 && (
                <div className="flex justify-between items-center py-1 pl-4">
                  <span className="text-gray-600 text-sm">Nexpress Labor:</span>
                  <span className="text-gray-700 text-sm">{formatCurrency(results.laborCosts.nexpress)}</span>
                </div>
              )}
            </div>
            
            {(results.postalCosts.handling > 0 || results.postalCosts.postage > 0) && (
              <div className="border-t pt-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700">Postal Handling:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(results.postalCosts.handling)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700">Postage:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(results.postalCosts.postage)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Totals and Profit */}
        <div className="space-y-4">
          {/* Subtotals */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-5">
            <h3 className="text-lg font-bold text-brand-indigo mb-4 border-b-2 border-brand-gold pb-2">
              Totals
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sub Total:</span>
                <span className="font-bold text-lg">{formatCurrency(results.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Overhead ({(jobConfig.overheadRate * 100).toFixed(0)}%):</span>
                <span className="font-bold text-lg">{formatCurrency(results.overhead)}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-brand-indigo font-bold">Total Cost:</span>
                <span className="font-bold text-xl text-brand-indigo">
                  {formatCurrency(results.totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Profit Calculation */}
          <div className="bg-gradient-to-br from-brand-gold to-yellow-400 rounded-lg p-5 border-2 border-white shadow-lg">
            <h3 className="text-lg font-bold text-brand-indigo mb-4">
              Profit Calculation
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-brand-indigo mb-2">
                Cost + Multiplier (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={jobConfig.costMultiplier * 100}
                  onChange={(e) => onUpdate({ costMultiplier: (parseFloat(e.target.value) || 100) / 100 })}
                  className="flex-1 px-3 py-2 border-2 border-brand-indigo rounded focus:ring-2 focus:ring-white focus:border-white font-bold text-center text-lg"
                  min="100"
                  step="5"
                />
                <span className="text-lg font-bold text-brand-indigo">%</span>
              </div>
            </div>
            
            <div className="space-y-3 border-t-2 border-brand-indigo pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-indigo">Profit:</span>
                <span className="font-bold text-lg text-brand-indigo">
                  {formatCurrency(results.profit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-indigo">FINAL PRICE:</span>
                <span className="font-bold text-2xl text-brand-indigo">
                  {formatCurrency(results.finalPrice)}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-white/80 rounded p-2">
                <span className="font-bold text-brand-indigo">Cost Per Piece:</span>
                <span className="font-bold text-xl text-brand-indigo">
                  {formatCurrency(results.costPerPiece)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button className="px-6 py-3 bg-white text-brand-indigo font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          📄 Export to PDF
        </button>
        <button className="px-6 py-3 bg-brand-gold text-brand-indigo font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          💾 Save Quote
        </button>
        <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          📧 Email Quote
        </button>
      </div>
    </div>
  );
};

export default CalculationResultsSection;
