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
      
      <div className="space-y-4">
        {/* First Row: Estimate Number, Customer Name, Customer Email */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Estimate Number - Very Small for 5 digits */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimate Number
            </label>
            <input
              type="text"
              value={jobConfig.jobNumber}
              onChange={(e) => onUpdate({ jobNumber: e.target.value })}
              className="w-full px-2 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors text-center"
              placeholder="00001"
              maxLength={5}
            />
          </div>

          {/* Customer Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={jobConfig.customer}
              onChange={(e) => onUpdate({ customer: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              placeholder="Customer name"
            />
          </div>

          {/* Customer Email - Larger for long emails */}
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Email
            </label>
            <input
              type="email"
              value={jobConfig.customerEmail || ''}
              onChange={(e) => onUpdate({ customerEmail: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              placeholder="customer@email.com"
            />
          </div>
        </div>

        {/* Second Row: Job Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description
          </label>
          <input
            type="text"
            value={jobConfig.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
            placeholder="Job description"
          />
        </div>
      </div>
    </div>
  );
};

export default JobInfoSection;
