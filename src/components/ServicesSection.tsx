import React from 'react';
import { JobConfig } from '../types/PricingTypes';

interface ServicesSectionProps {
  jobConfig: JobConfig;
  onUpdate: (updates: Partial<JobConfig>) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ jobConfig, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-darker-blue">
      <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">Additional Services</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Postal Services */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📮</span>
            Postal Services
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="outsourcePostal"
                checked={jobConfig.outsourcePostal}
                onChange={(e) => onUpdate({ outsourcePostal: e.target.checked })}
                className="w-5 h-5 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold"
              />
              <label htmlFor="outsourcePostal" className="ml-3 font-semibold text-gray-700">
                Outsource Postal Service
              </label>
            </div>

            {jobConfig.outsourcePostal && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Postal Handling Fee
                  </label>
                  <input
                    type="number"
                    value={jobConfig.postalHandlingFee}
                    onChange={(e) => onUpdate({ postalHandlingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                    min="0"
                    step="0.01"
                    placeholder="Enter fee"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Enter POSTAL RATE
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">$</span>
                    <input
                      type="number"
                      value={jobConfig.postalRate}
                      onChange={(e) => onUpdate({ postalRate: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      min="0"
                      step="0.0001"
                      placeholder="0.0000"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="text-xs text-blue-700">
                <strong>Postage ?s</strong><br/>
                Check current USPS rates for accurate pricing
              </p>
            </div>
          </div>
        </div>

        {/* Mailing & Overhead */}
        <div className="space-y-4">
          {/* Mailing List */}
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <h3 className="text-lg font-bold text-green-900 mb-4">Mailing & Overhead Charges</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mailingList"
                  checked={jobConfig.mailingList}
                  onChange={(e) => onUpdate({ mailingList: e.target.checked })}
                  className="w-5 h-5 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold"
                />
                <label htmlFor="mailingList" className="ml-3 font-semibold text-gray-700">
                  Mailing List "Cross" & Cost
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="glosserData"
                  checked={jobConfig.glosserData}
                  onChange={(e) => onUpdate({ glosserData: e.target.checked })}
                  className="w-5 h-5 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold"
                />
                <label htmlFor="glosserData" className="ml-3 font-semibold text-gray-700">
                  Enter Glosser Data
                </label>
              </div>
            </div>
          </div>

          {/* Overhead Rate */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Overhead Rate (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={jobConfig.overheadRate * 100}
                onChange={(e) => onUpdate({ overheadRate: (parseFloat(e.target.value) || 0) / 100 })}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                min="0"
                max="100"
                step="1"
              />
              <span className="text-lg font-bold text-gray-600">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: 25%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
