import React from 'react';
import { JobConfig } from '../types/PricingTypes';

interface JobInfoSectionProps {
  jobConfig: JobConfig;
  onUpdate: (updates: Partial<JobConfig>) => void;
}

const JobInfoSection: React.FC<JobInfoSectionProps> = ({ jobConfig, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-darker-blue">
      <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">Job Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Job Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Number
          </label>
          <input
            type="text"
            value={jobConfig.jobNumber}
            onChange={(e) => onUpdate({ jobNumber: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
            placeholder="Enter job #"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={jobConfig.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
            placeholder="Job description"
          />
        </div>

        {/* Customer */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Customer
          </label>
          <input
            type="text"
            value={jobConfig.customer}
            onChange={(e) => onUpdate({ customer: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
            placeholder="Customer name"
          />
        </div>

        {/* Yield */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Yield
          </label>
          <input
            type="number"
            value={jobConfig.yield === 0 ? '' : jobConfig.yield}
            onChange={(e) => onUpdate({ yield: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
            min="0"
            placeholder="Enter yield quantity"
          />
        </div>

        {/* Gloss */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gloss
          </label>
          <select
            value={jobConfig.gloss}
            onChange={(e) => onUpdate({ gloss: parseInt(e.target.value) as 0 | 1 })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
          >
            <option value={0}>No Gloss (0)</option>
            <option value={1}>Gloss (1)</option>
          </select>
        </div>

        {/* Sheets Glossed */}
        {jobConfig.gloss === 1 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sheets Glossed
              </label>
              <input
                type="number"
                value={jobConfig.sheetsGlossed}
                onChange={(e) => onUpdate({ sheetsGlossed: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sides Glossed
              </label>
              <select
                value={jobConfig.sidesGlossed}
                onChange={(e) => onUpdate({ sidesGlossed: parseInt(e.target.value) as 0 | 1 | 2 })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              >
                <option value={0}>None</option>
                <option value={1}>1 Side</option>
                <option value={2}>2 Sides</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobInfoSection;
