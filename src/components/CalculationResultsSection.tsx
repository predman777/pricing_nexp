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
        Calculation Results
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
                  Calibrated Multiplier Override (%)
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
                  Nexpress 4/4 Rate ($/sheet)
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
                  Final Cost Multiplier (%)
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
            Export to PDF
          </button>
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg shadow cursor-not-allowed opacity-50">
            Save Quote
          </button>
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-lg shadow cursor-not-allowed opacity-50">
            Email Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-indigo to-purple-800 rounded-xl shadow-2xl p-6 border-2 border-brand-gold">
      <h2 className="text-2xl font-bold text-white mb-6 font-display">
        Calculation Results
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
                  <div className="text-xs text-gray-500 pl-2 space-y-0.5">
                    <div>• Quantity: {paper.quantity} sheets × ${paper.costPerSheet.toFixed(3)} = {formatCurrency(paper.quantity * paper.costPerSheet)}</div>
                    <div>• Setup sheets: {paper.setupSheets} × ${paper.costPerSheet.toFixed(3)} = {formatCurrency(paper.setupSheets * paper.costPerSheet)}</div>
                    <div className="font-medium">• Total: {paper.sheets} sheets = {formatCurrency(paper.totalCost)}</div>
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
                    <div className="text-xs text-gray-500 pl-2 space-y-0.5">
                      {consumable.name === "ORC's Standard" ? (
                        <div>• Formula: (quantity × 2) + 10 sheets × ${consumable.rate.toFixed(3)}/sheet</div>
                      ) : (
                        <div>• {consumable.sheets} sheets × ${consumable.rate.toFixed(6)}/sheet</div>
                      )}
                      <div className="font-medium">• Total: {formatCurrency(consumable.cost)}</div>
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
                    <div className="text-xs text-gray-500 pl-2 space-y-0.5">
                      <div>• 4/0 rate: $0.045/sheet | 4/4 rate: ${jobConfig.nexpressLabor4_4Rate || 0.079}/sheet</div>
                      <div>• Total: {results.laborCosts.nexpressDetails.totalSheets} sheets × blended rate</div>
                      <div className="font-medium">• Cost: {formatCurrency(results.laborCosts.nexpress)}</div>
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
            
            {/* Subtotal Before Multiplier */}
            <div className="border-t-2 border-gray-400 pt-2 mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-bold">Subtotal (before multiplier):</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(
                    results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0) + 
                    results.totalConsumables + 
                    results.laborCosts.nexpress + 
                    results.businessCardCosts.total
                  )}
                </span>
              </div>
            </div>
            
            {/* Calibrated Multiplier Line Item */}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-purple-700 font-semibold">
                  + Calibrated Multiplier ({results.diagnosticInfo?.calibratedMultiplierInfo?.appliedPercentage || 167}%):
                </span>
                <span className="font-bold text-purple-700">
                  +{formatCurrency(
                    (results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0) + 
                     results.totalConsumables + 
                     results.laborCosts.nexpress + 
                     results.businessCardCosts.total) * 
                    ((results.diagnosticInfo?.calibratedMultiplierInfo?.appliedMultiplier || 1.67) - 1)
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500 pl-4">
                Applied to paper, consumables, and nexpress labor based on {results.diagnosticInfo?.calibratedMultiplierInfo?.totalSheets || 0} sheet quantity
              </div>
            </div>
            
            {/* Subtotal After Multiplier */}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-brand-indigo font-bold">= Subtotal (with multiplier):</span>
                <span className="font-bold text-xl text-brand-indigo">
                  {formatCurrency(
                    (results.paperCosts.reduce((sum, p) => sum + p.totalCost, 0) + 
                     results.totalConsumables + 
                     results.laborCosts.nexpress + 
                     results.businessCardCosts.total) * 
                    (results.diagnosticInfo?.calibratedMultiplierInfo?.appliedMultiplier || 1.67) +
                    results.laborCosts.prePress + 
                    results.laborCosts.variableData + 
                    results.laborCosts.bindery
                  )}
                </span>
              </div>
            </div>
            
            {/* Overhead */}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-bold">+ Overhead ({(jobConfig.overheadRate * 100).toFixed(0)}%):</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(results.overhead)}
                </span>
              </div>
              <div className="text-xs text-gray-500 pl-4">
                Facility costs, utilities, equipment depreciation, and general business expenses
              </div>
            </div>
            
            {/* Final Total Cost */}
            <div className="border-t-2 border-brand-gold pt-3 mt-2">
              <div className="bg-brand-pale-gold p-3 rounded border-2 border-brand-gold">
                <div className="flex justify-between items-center">
                  <span className="text-brand-indigo font-bold text-xl">TOTAL COST:</span>
                  <span className="font-bold text-3xl text-brand-indigo">
                    {formatCurrency(results.totalCost)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Calibrated Multiplier Explanation */}
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-1">Why Calibrated Multiplier Increases with Volume:</p>
              <ul className="text-xs text-gray-600 space-y-0.5 pl-2">
                <li>• Setup costs spread over more pieces (economies of scale)</li>
                <li>• Better material rates achieved on larger orders</li>
                <li>• Production efficiency improves on longer runs</li>
                <li>• Higher volume jobs justify premium pricing in printing industry</li>
              </ul>
            </div>


          </div>
        </div>

        {/* Pricing Controls & Final Results */}
        <div className="space-y-4">
          {/* Profit Configuration */}
          <div className="bg-gradient-to-br from-brand-gold to-yellow-400 rounded-lg p-5 border-2 border-white shadow-lg">
            <h3 className="text-lg font-bold text-brand-indigo mb-4">
              Pricing Controls
            </h3>
            
            {/* Final Cost Multiplier */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-brand-indigo mb-2">
                Final Cost Multiplier (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={jobConfig.costMultiplier * 100}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      // Allow empty field temporarily while typing
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue) && numValue >= 100) {
                      onUpdate({ costMultiplier: numValue / 100 });
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure we have a valid value when user leaves the field
                    const value = parseFloat(e.target.value);
                    if (isNaN(value) || value < 100) {
                      onUpdate({ costMultiplier: 1.25 }); // Reset to default
                    }
                  }}
                  className="flex-1 px-3 py-2 border-2 border-brand-indigo rounded focus:ring-2 focus:ring-white focus:border-white font-bold text-center text-lg"
                  min="100"
                  step="1"
                />
                <span className="text-lg font-bold text-brand-indigo">%</span>
              </div>
              <p className="text-xs text-brand-indigo mt-1">Applied to total cost for final price</p>
            </div>
          </div>

          {/* Final Results */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-5 border-2 border-green-400 shadow-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              Final Quote
            </h3>
            
            <div className="space-y-3">
              <div className="bg-white/80 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Total Cost:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(results.totalCost)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Includes overhead at {(jobConfig.overheadRate * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="bg-white/80 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-700">Profit Margin ({(jobConfig.costMultiplier * 100).toFixed(0)}%):</span>
                  <span className="font-bold text-lg text-green-700">
                    {formatCurrency(results.profit)}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Final Cost Multiplier: {(jobConfig.costMultiplier * 100).toFixed(0)}% applied to total cost
                </div>
              </div>
              
              <div className="bg-green-600 text-white rounded p-4 border-2 border-green-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">FINAL PRICE:</span>
                  <span className="font-bold text-3xl">
                    {formatCurrency(results.finalPrice)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold">Cost Per Piece:</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(results.costPerPiece)}
                  </span>
                </div>
                
                <div className="text-xs text-green-200 mt-2 text-center">
                  Based on {jobConfig.yield} pieces yield
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button className="px-6 py-3 bg-white text-brand-indigo font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Export to PDF
        </button>
        <button className="px-6 py-3 bg-brand-gold text-brand-indigo font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Save Quote
        </button>
        <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Email Quote
        </button>
      </div>
    </div>
  );
};

export default CalculationResultsSection;
