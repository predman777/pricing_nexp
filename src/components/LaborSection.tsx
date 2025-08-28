import React from 'react';
import { JobConfig } from '../types/PricingTypes';

interface LaborSectionProps {
  jobConfig: JobConfig;
  onUpdate: (updates: Partial<JobConfig>) => void;
  selectedPaper?: {
    id: string;
    name: string;
    prices: {
      '8.5x11': number;
      '14x20': number;
    };
  };
}

const LaborSection: React.FC<LaborSectionProps> = ({ jobConfig, onUpdate, selectedPaper }) => {
  // Calculate total sheets for Nexpress labor display - quantities ARE the sheet counts
  const calculateTotalSheets = () => {
    if (!selectedPaper) return 0;
    let totalSheets = 0;
    
    Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
      Object.entries(colorOptions).forEach(([colors, quantity]) => {
        if (quantity > 0) {
          const sizeKey = size as '8.5x11' | '14x20';
          const costPerSheet = selectedPaper.prices[sizeKey];
          
          // Only count sheets if the paper has a valid cost for this size
          if (costPerSheet && costPerSheet > 0) {
            totalSheets += quantity; // Quantity IS the sheet count
          }
        }
      });
    });
    
    return totalSheets;
  };

  const totalSheets = calculateTotalSheets();
  const nexpressLabor = totalSheets * 0.045; // $0.045 per sheet
  
  // Calculate costs for display
  const prePressCost = (jobConfig.prePresTime || 0) * 150;
  const variableDataCost = (jobConfig.variableDataTime || 0) * 95;
  const binderyCost = (jobConfig.binderyTime || 0) * 65;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-darker-blue">
      <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">Labor & Outsourcing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Pre Press Time */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pre Press Time (hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={jobConfig.prePresTime || ''}
              onChange={(e) => onUpdate({ prePresTime: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              min="0"
              step="0.25"
              placeholder="0.1"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">@ $150/hr</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${prePressCost.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Variable Data Development */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Variable Data Dev. (hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={jobConfig.variableDataTime || ''}
              onChange={(e) => onUpdate({ variableDataTime: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              min="0"
              step="0.25"
              placeholder="0"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">@ $95/hr</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${variableDataCost.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Bindery Time */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bindery Time (hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={jobConfig.binderyTime || ''}
              onChange={(e) => onUpdate({ binderyTime: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              min="0"
              step="0.25"
              placeholder="0.25"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">@ $65/hr</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${binderyCost.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Nexpress Labor (Calculated) */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nexpress Labor (calculated)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={totalSheets > 0 ? `${totalSheets} sheets` : 'No sheets'}
              readOnly
              className="w-24 px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-600 cursor-not-allowed text-sm"
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">$0.045/sheet (4/0)</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${nexpressLabor.toFixed(2)}
            </span>
          </p>
        </div>
        
        {/* 4/4 Nexpress Labor Rate */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            4/4 Labor Rate (/sheet)
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">$</span>
            <input
              type="number"
              value={jobConfig.nexpressLabor4_4Rate || ''}
              onChange={(e) => onUpdate({ nexpressLabor4_4Rate: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              min="0"
              step="0.001"
              placeholder="0.079"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Default: <span className="font-semibold text-orange-700">
              $0.079 (76% increase)
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default LaborSection;
