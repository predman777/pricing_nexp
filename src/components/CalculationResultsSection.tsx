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
              
              {/* Calibrated Multiplier Override */}
              <div className="mb-4 border-b border-brand-indigo pb-3">
                <label className="block text-sm font-bold text-brand-indigo mb-2">
                  🎯 Calibrated Multiplier Override (%)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={jobConfig.calibratedMultiplier ? (jobConfig.calibratedMultiplier * 100) : 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 100) {
                          onUpdate({ calibratedMultiplier: value / 100 });
                        } else if (e.target.value === '') {
                          onUpdate({ calibratedMultiplier: undefined });
                        }
                      }}
                    className="flex-1 px-3 py-2 border-2 border-brand-indigo rounded focus:ring-2 focus:ring-white focus:border-white font-bold text-center text-lg"
                    min="100"
                    step="1"
                  />
                  <span className="text-lg font-bold text-brand-indigo">%</span>
                </div>
                <p className="text-xs text-brand-indigo mt-1">
                  {jobConfig.calibratedMultiplier ? 
                    'Overriding automatic curve' : 
                    'Using automatic curve (100-153% based on sheet count)'
                  }
                </p>
              </div>
              
              {/* 4/4 Nexpress Rate Override */}
              <div className="mb-4 border-b border-brand-indigo pb-3">
                <label className="block text-sm font-bold text-brand-indigo mb-2">
                  ⚙️ Nexpress 4/4 Rate ($/sheet)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-brand-indigo">$</span>
                  <input
                    type="number"
                    value={jobConfig.nexpressLabor4_4Rate || 0.079}
                    onChange={(e) => onUpdate({ nexpressLabor4_4Rate: parseFloat(e.target.value) || 0.079 })}
                    className="flex-1 px-3 py-2 border-2 border-brand-indigo rounded focus:ring-2 focus:ring-white focus:border-white font-bold text-center text-lg"
                    min="0"
                    step="0.001"
                  />
                </div>
                <p className="text-xs text-brand-indigo mt-1">
                  Labor rate per sheet for 4/4 color printing
                </p>
              </div>

              {/* Final Cost Multiplier */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-brand-indigo mb-2">
                  💰 Final Cost Multiplier (%)
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
                <p className="text-sm text-brand-indigo mt-1">Applied to total cost for final price</p>
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
            {/* Paper Cost Detailed Breakdown */}
            <div className="border-b pb-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-semibold">Paper Cost:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0))}
                </span>
              </div>
              {results.paperCosts.map((paper, index) => (
                <div key={index} className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{paper.size} {paper.colors}:</span>
                    <span className="text-gray-700">{formatCurrency(paper.totalCost)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-2">
                    ({paper.quantity} + {paper.setupSheets} setup) × ${paper.costPerSheet.toFixed(3)}/sheet = {paper.sheets} sheets
                  </div>
                </div>
              ))}
            </div>
            
            {/* Protective Coating Breakdown */}
            {results.protectiveCoatingCost > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700">Protective Coating:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.protectiveCoatingCost)}</span>
              </div>
            )}
            
            {/* Consumables Detailed Breakdown */}
            <div className="border-b pb-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-semibold">Consumables:</span>
                <span className="font-bold text-gray-900">{formatCurrency(results.totalConsumables)}</span>
              </div>
              {results.consumablesCosts.map((consumable, index) => (
                <div key={index} className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{consumable.name}:</span>
                    <span className="text-gray-700">{formatCurrency(consumable.cost)}</span>
                  </div>
                  {consumable.sheets && consumable.rate && (
                    <div className="text-xs text-gray-500 pl-2">
                      {consumable.sheets} sheets × ${consumable.rate.toFixed(6)}/sheet
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {results.businessCardCosts.total > 0 && (
              <div className="border-b pb-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700 font-semibold">Business Cards:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(results.businessCardCosts.total * jobConfig.costMultiplier)}</span>
                </div>
                <div className="text-xs text-purple-600 font-semibold pl-4 pt-1">
                  Base: {formatCurrency(results.businessCardCosts.total)} → 
                  Marked up: {formatCurrency(results.businessCardCosts.total * jobConfig.costMultiplier)} 
                  (+{formatCurrency(results.businessCardCosts.total * (jobConfig.costMultiplier - 1))})
                </div>
              </div>
            )}
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-semibold">Labor Costs:</span>
                <span className="font-bold text-brand-indigo">
                  {formatCurrency(
                    results.laborCosts.prePress + 
                    results.laborCosts.variableData + 
                    results.laborCosts.bindery + 
                    results.laborCosts.nexpress + 
                    results.laborCosts.glosser + 
                    results.laborCosts.electrical + 
                    results.laborCosts.toneService
                  )}
                </span>
              </div>
              
              {results.laborCosts.prePress > 0 && (
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Pre Press:</span>
                    <span className="text-gray-700">{formatCurrency(results.laborCosts.prePress)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-2">
                    {jobConfig.prePresTime} hrs × $150.00/hr
                  </div>
                </div>
              )}
              
              {results.laborCosts.variableData > 0 && (
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Variable Data:</span>
                    <span className="text-gray-700">{formatCurrency(results.laborCosts.variableData)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-2">
                    {jobConfig.variableDataTime} hrs × $95.00/hr
                  </div>
                </div>
              )}
              
              {results.laborCosts.bindery > 0 && (
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Bindery:</span>
                    <span className="text-gray-700">{formatCurrency(results.laborCosts.bindery)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-2">
                    {jobConfig.binderyTime} hrs × $65.00/hr
                  </div>
                </div>
              )}
              
              {results.laborCosts.nexpress > 0 && (
                <div className="pl-4 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Nexpress Labor:</span>
                    <span className="text-gray-700">{formatCurrency(results.laborCosts.nexpress)}</span>
                  </div>
                  {results.laborCosts.nexpressDetails && (
                    <div className="text-xs text-gray-500 pl-2">
                      {results.laborCosts.nexpressDetails.totalSheets} sheets × ${results.laborCosts.nexpressDetails.rate}/sheet
                    </div>
                  )}
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
            
            
            {/* Cost Totals - Complete Breakdown */}
            <div className="mt-4 pt-4 border-t-2 border-brand-gold">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
                <h4 className="font-semibold text-brand-indigo mb-2">Cost Totals Breakdown</h4>
                
                {/* Base costs that get multiplier */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Paper Cost:</span>
                    <span className="font-semibold">
                      {formatCurrency(results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Consumables:</span>
                    <span className="font-semibold">
                      {formatCurrency(results.totalConsumables)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Nexpress Labor:</span>
                    <span className="font-semibold">
                      {formatCurrency(results.laborCosts.nexpress)}
                    </span>
                  </div>
                  {results.businessCardCosts.total > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700">Business Cards (base):</span>
                      <span className="font-semibold">
                        {formatCurrency(results.businessCardCosts.total)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-1">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700 font-semibold">Subtotal (before multiplier):</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0) + 
                          results.totalConsumables + 
                          results.laborCosts.nexpress + 
                          results.businessCardCosts.total
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-100 p-2 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-800 font-semibold">After {results.diagnosticInfo?.calibratedMultiplierInfo?.appliedPercentage || 167}% Multiplier:</span>
                      <span className="font-semibold text-purple-800">
                        {formatCurrency(
                          (results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0) + 
                           results.totalConsumables + 
                           results.laborCosts.nexpress + 
                           results.businessCardCosts.total) * 
                          (results.diagnosticInfo?.calibratedMultiplierInfo?.appliedMultiplier || 1.67)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Other costs (no multiplier) */}
                <div className="mt-3 space-y-1">
                  <h5 className="font-semibold text-gray-700 text-sm border-b pb-1">Other Costs (No Multiplier Applied)</h5>
                  {results.laborCosts.prePress > 0 && (
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">Pre Press Labor:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.laborCosts.prePress)}
                      </span>
                    </div>
                  )}
                  {results.laborCosts.variableData > 0 && (
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">Variable Data Labor:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.laborCosts.variableData)}
                      </span>
                    </div>
                  )}
                  {results.laborCosts.bindery > 0 && (
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">Bindery Labor:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.laborCosts.bindery)}
                      </span>
                    </div>
                  )}
                  {results.protectiveCoatingCost > 0 && (
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">Protective Coating:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.protectiveCoatingCost)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-1">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-700 font-semibold">COST TOTAL:</span>
                      <span className="font-bold text-brand-indigo">
                        {formatCurrency(results.subtotal)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-700">Overhead ({(jobConfig.overheadRate * 100).toFixed(0)}%):</span>
                    <span className="font-semibold">
                      {formatCurrency(results.overhead)}
                    </span>
                  </div>
                  
                  <div className="bg-brand-pale-gold p-2 rounded border border-brand-gold">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-indigo font-semibold">FINAL TOTAL COST:</span>
                      <span className="font-bold text-lg text-brand-indigo">
                        {formatCurrency(results.totalCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calibrated Multiplier Note - Bottom Reference */}
            <div className="mt-3 pt-2 border-t border-gray-300">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">
                  <strong>Calibrated Multiplier ({results.diagnosticInfo?.calibratedMultiplierInfo?.appliedPercentage || 167}%):</strong> 
                  Applied to paper, consumables, and nexpress labor based on quantity curve.
                  {results.diagnosticInfo?.calibratedMultiplierInfo && (
                    <span> {results.diagnosticInfo.calibratedMultiplierInfo.totalSheets} sheets 
                    (Range: {Math.round(results.diagnosticInfo.calibratedMultiplierInfo.curveDetails.lowMultiplier * 100)}%-{Math.round(results.diagnosticInfo.calibratedMultiplierInfo.curveDetails.highMultiplier * 100)}% 
                    for {results.diagnosticInfo.calibratedMultiplierInfo.curveDetails.lowQtyThreshold}-{results.diagnosticInfo.calibratedMultiplierInfo.curveDetails.highQtyThreshold} sheets)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis - Right Side */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-br from-brand-gold to-yellow-400 rounded-lg p-5 border-2 border-white shadow-lg">
            <h3 className="text-lg font-bold text-brand-indigo mb-4">
              📊 Pricing Synopsis
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/80 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-brand-indigo font-bold">Total Cost:</span>
                  <span className="font-bold text-xl text-brand-indigo">
                    {formatCurrency(results.totalCost)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Includes overhead at {(jobConfig.overheadRate * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Final Cost Multiplier */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-brand-indigo mb-2">
                    💰 Final Cost Multiplier (%)
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
                  <p className="text-xs text-brand-indigo mt-1">Applied to total cost for final price</p>
                </div>
                
                <div className="bg-white/80 rounded p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-indigo">Profit Margin:</span>
                    <span className="font-bold text-lg text-brand-indigo">
                      {formatCurrency(results.profit)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded p-4 border-2 border-green-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-green-800 text-lg">FINAL PRICE:</span>
                    <span className="font-bold text-3xl text-green-800">
                      {formatCurrency(results.finalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-700">Cost Per Piece:</span>
                    <span className="font-bold text-xl text-green-700">
                      {formatCurrency(results.costPerPiece)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-green-600 mt-2">
                    Based on {jobConfig.yield} pieces yield
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats - Simple Cost + Profit = Total */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-4">
            <h4 className="text-md font-bold text-brand-indigo mb-3">💰 Simple Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Cost:</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(results.totalCost)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">× Profit Multiplier:</span>
                <span className="font-semibold text-brand-indigo">{(jobConfig.costMultiplier * 100).toFixed(0)}%</span>
              </div>
              
              <div className="border-t-2 border-brand-gold pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-brand-indigo font-bold text-lg">FINAL PRICE:</span>
                  <span className="font-bold text-2xl text-green-600">{formatCurrency(results.finalPrice)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                <span className="text-gray-600">Per Piece ({jobConfig.yield} pieces):</span>
                <span className="font-semibold">{formatCurrency(results.costPerPiece)}</span>
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
