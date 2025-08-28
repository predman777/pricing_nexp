import React, { useState } from 'react';

interface CustomPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customPaper: CustomPaperData) => void;
  currentPrices?: {
    '8.5x11': number;
    '13x20': number;
    '14x20': number;
  };
}

export interface CustomPaperData {
  name: string;
  weight?: string;
  type?: 'cover' | 'text' | '';
  prices: {
    '8.5x11': number;
    '13x20': number;
    '14x20': number;
  };
  saveToList?: boolean;
}

const CustomPaperModal: React.FC<CustomPaperModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  currentPrices = { '8.5x11': 0, '13x20': 0, '14x20': 0 }
}) => {
  const [customData, setCustomData] = useState<CustomPaperData>({
    name: '',
    weight: '',
    type: '',
    prices: currentPrices,
    saveToList: false
  });
  
  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCustomData({
        name: '',
        weight: '',
        type: '',
        prices: currentPrices,
        saveToList: false
      });
    }
  }, [isOpen, currentPrices]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(customData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">
          Custom Paper Configuration
        </h2>
        
        {/* Paper Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Paper Name
          </label>
          <input
            type="text"
            value={customData.name}
            onChange={(e) => setCustomData({...customData, name: e.target.value})}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., Premium Matte"
          />
        </div>

        {/* Weight (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Weight (Optional)
          </label>
          <input
            type="text"
            value={customData.weight}
            onChange={(e) => setCustomData({...customData, weight: e.target.value})}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            placeholder="e.g., 100#"
          />
        </div>

        {/* Type (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type (Optional)
          </label>
          <select
            value={customData.type}
            onChange={(e) => setCustomData({...customData, type: e.target.value as 'cover' | 'text' | ''})}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">Not Specified</option>
            <option value="cover">Cover</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pricing per Sheet
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">8.5"x11"</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">$</span>
                <input
                  type="number"
                  value={customData.prices['8.5x11']}
                  onChange={(e) => setCustomData({
                    ...customData, 
                    prices: {
                      ...customData.prices,
                      '8.5x11': parseFloat(e.target.value) || 0
                    }
                  })}
                  className="flex-1 px-2 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-sm"
                  step="0.001"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">13"x20"</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">$</span>
                <input
                  type="number"
                  value={customData.prices['13x20']}
                  onChange={(e) => setCustomData({
                    ...customData, 
                    prices: {
                      ...customData.prices,
                      '13x20': parseFloat(e.target.value) || 0
                    }
                  })}
                  className="flex-1 px-2 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-sm"
                  step="0.001"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">14"x20"</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">$</span>
                <input
                  type="number"
                  value={customData.prices['14x20']}
                  onChange={(e) => setCustomData({
                    ...customData, 
                    prices: {
                      ...customData.prices,
                      '14x20': parseFloat(e.target.value) || 0
                    }
                  })}
                  className="flex-1 px-2 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold text-sm"
                  step="0.001"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save to List Option */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customData.saveToList}
              onChange={(e) => setCustomData({...customData, saveToList: e.target.checked})}
              className="w-5 h-5 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold"
            />
            <span className="text-sm text-gray-700">Save this paper to my custom papers list</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-gold text-brand-indigo rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPaperModal;
