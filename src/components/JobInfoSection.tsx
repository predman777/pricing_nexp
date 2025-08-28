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

        {/* Bindery Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bindery Time (hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={jobConfig.binderyTime || ''}
              onChange={(e) => onUpdate({ binderyTime: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              min="0"
              step="0.25"
              placeholder="0.25"
            />
            <span className="text-sm text-gray-500">@ $65/hr</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${((jobConfig.binderyTime || 0) * 65).toFixed(2)}
            </span>
          </p>
        </div>

        {/* Pre Press Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pre Press Time (hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={jobConfig.prePresTime || ''}
              onChange={(e) => onUpdate({ prePresTime: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              min="0"
              step="0.25"
              placeholder="0.1"
            />
            <span className="text-sm text-gray-500">@ $150/hr</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost: <span className="font-semibold text-blue-700">
              ${((jobConfig.prePresTime || 0) * 150).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobInfoSection;
