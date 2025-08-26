import React, { useState, useEffect } from 'react';
import { PaperStock, Consumable, MasterConfig } from '../types/PricingTypes';
import { paperStocks as defaultPaperStocks, consumables as defaultConsumables, masterConfig as defaultMasterConfig } from '../data/pricingData';

interface AdminPanelProps {
  onClose: () => void;
  onSave: (data: { paperStocks: PaperStock[], consumables: Consumable[], masterConfig: MasterConfig }) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onSave }) => {
  const [paperStocks, setPaperStocks] = useState<PaperStock[]>(defaultPaperStocks);
  const [consumables, setConsumables] = useState<Consumable[]>(defaultConsumables);
  const [masterConfig, setMasterConfig] = useState<MasterConfig>(defaultMasterConfig);
  const [activeTab, setActiveTab] = useState<'paper' | 'consumables' | 'labor' | 'setup'>('paper');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pricingData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.paperStocks) setPaperStocks(parsed.paperStocks);
      if (parsed.consumables) setConsumables(parsed.consumables);
      if (parsed.masterConfig) setMasterConfig(parsed.masterConfig);
    }
  }, []);

  const handleAuthenticate = () => {
    // Simple password check - you can make this more secure
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSave = () => {
    const data = { paperStocks, consumables, masterConfig };
    
    // Save to localStorage
    localStorage.setItem('pricingData', JSON.stringify(data));
    
    // Pass data to parent
    onSave(data);
    
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setPaperStocks(defaultPaperStocks);
      setConsumables(defaultConsumables);
      setMasterConfig(defaultMasterConfig);
      localStorage.removeItem('pricingData');
      alert('Settings reset to defaults');
    }
  };

  const updatePaperPrice = (index: number, size: '8.5x11' | '14x20', value: number) => {
    const newStocks = [...paperStocks];
    newStocks[index].prices[size] = value;
    setPaperStocks(newStocks);
  };

  const updateConsumablePrice = (index: number, type: '4/0' | '4/4', value: number) => {
    const newConsumables = [...consumables];
    newConsumables[index].costPerSheet[type] = value;
    setConsumables(newConsumables);
  };

  const updateLaborRate = (field: keyof typeof masterConfig.laborRates, value: number) => {
    setMasterConfig({
      ...masterConfig,
      laborRates: {
        ...masterConfig.laborRates,
        [field]: value
      }
    });
  };

  const updateSetupCost = (field: keyof typeof masterConfig.setupCosts, value: number) => {
    setMasterConfig({
      ...masterConfig,
      setupCosts: {
        ...masterConfig.setupCosts,
        [field]: value
      }
    });
  };

  const addNewPaper = () => {
    const newPaper: PaperStock = {
      id: `custom-${Date.now()}`,
      name: 'New Paper',
      category: 'text',
      manufacturer: 'Custom',
      prices: {
        '8.5x11': 0.000,
        '14x20': 0.000
      },
      availableSizes: ['8.5x11', '14x20']
    };
    setPaperStocks([...paperStocks, newPaper]);
  };

  const deletePaper = (index: number) => {
    if (window.confirm('Are you sure you want to delete this paper stock?')) {
      const newPaperStocks = paperStocks.filter((_, i) => i !== index);
      setPaperStocks(newPaperStocks);
    }
  };

  const updatePaperField = (index: number, field: keyof PaperStock, value: any) => {
    const newStocks = [...paperStocks];
    if (field === 'availableSizes') {
      // Handle checkbox changes for available sizes
      const currentSizes = newStocks[index].availableSizes || ['8.5x11', '14x20'];
      if (currentSizes.includes(value)) {
        newStocks[index].availableSizes = currentSizes.filter(size => size !== value);
      } else {
        newStocks[index].availableSizes = [...currentSizes, value];
      }
    } else {
      (newStocks[index] as any)[field] = value;
    }
    setPaperStocks(newStocks);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-brand-indigo mb-6 font-display">Admin Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="Enter admin password"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAuthenticate}
                className="flex-1 bg-brand-indigo text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Login
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-brand-indigo text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-display">Admin Panel - Master Database</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-brand-gold transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 border-b border-gray-300">
          <div className="flex space-x-1 p-2">
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'paper'
                  ? 'bg-white text-brand-indigo shadow'
                  : 'text-gray-600 hover:text-brand-indigo'
              }`}
            >
              Paper Stocks
            </button>
            <button
              onClick={() => setActiveTab('consumables')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'consumables'
                  ? 'bg-white text-brand-indigo shadow'
                  : 'text-gray-600 hover:text-brand-indigo'
              }`}
            >
              Consumables
            </button>
            <button
              onClick={() => setActiveTab('labor')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'labor'
                  ? 'bg-white text-brand-indigo shadow'
                  : 'text-gray-600 hover:text-brand-indigo'
              }`}
            >
              Labor Rates
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'setup'
                  ? 'bg-white text-brand-indigo shadow'
                  : 'text-gray-600 hover:text-brand-indigo'
              }`}
            >
              Setup & Config
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Paper Stocks Tab */}
          {activeTab === 'paper' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-indigo">Paper Stock Management</h3>
                <button
                  onClick={addNewPaper}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Add New Paper</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Manufacturer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">8.5"x11" Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">14"x20" Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Available Sizes</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paperStocks.map((stock, index) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={stock.name}
                            onChange={(e) => updatePaperField(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={stock.manufacturer}
                            onChange={(e) => updatePaperField(index, 'manufacturer', e.target.value)}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <select
                            value={stock.category}
                            onChange={(e) => updatePaperField(index, 'category', e.target.value)}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                          >
                            <option value="cover">Cover</option>
                            <option value="text">Text</option>
                            <option value="label">Label</option>
                            <option value="specialty">Specialty</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">$</span>
                            <input
                              type="number"
                              value={stock.prices['8.5x11']}
                              onChange={(e) => updatePaperPrice(index, '8.5x11', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                              step="0.001"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">$</span>
                            <input
                              type="number"
                              value={stock.prices['14x20']}
                              onChange={(e) => updatePaperPrice(index, '14x20', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                              step="0.001"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex flex-col space-y-1">
                            <label className="flex items-center space-x-1 text-xs">
                              <input
                                type="checkbox"
                                checked={stock.availableSizes?.includes('8.5x11') ?? true}
                                onChange={() => updatePaperField(index, 'availableSizes', '8.5x11')}
                                className="w-3 h-3"
                              />
                              <span>8.5×11</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs">
                              <input
                                type="checkbox"
                                checked={stock.availableSizes?.includes('14x20') ?? true}
                                onChange={() => updatePaperField(index, 'availableSizes', '14x20')}
                                className="w-3 h-3"
                              />
                              <span>14×20</span>
                            </label>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => deletePaper(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-semibold"
                            title="Delete Paper"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Consumables Tab */}
          {activeTab === 'consumables' && (
            <div>
              <h3 className="text-lg font-bold text-brand-indigo mb-4">Press Consumables</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Consumable Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">4/0 Cost per Sheet</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">4/4 Cost per Sheet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumables.map((consumable, index) => (
                      <tr key={consumable.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">
                          {consumable.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">$</span>
                            <input
                              type="number"
                              value={consumable.costPerSheet['4/0']}
                              onChange={(e) => updateConsumablePrice(index, '4/0', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                              step="0.0001"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">$</span>
                            <input
                              type="number"
                              value={consumable.costPerSheet['4/4']}
                              onChange={(e) => updateConsumablePrice(index, '4/4', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                              step="0.0001"
                              min="0"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Labor Rates Tab */}
          {activeTab === 'labor' && (
            <div>
              <h3 className="text-lg font-bold text-brand-indigo mb-4">Labor Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pre Press (per hour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={masterConfig.laborRates.prePress}
                      onChange={(e) => updateLaborRate('prePress', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Variable Data (per hour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={masterConfig.laborRates.variableData}
                      onChange={(e) => updateLaborRate('variableData', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bindery (per hour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={masterConfig.laborRates.bindery}
                      onChange={(e) => updateLaborRate('bindery', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Glosser (per hour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={masterConfig.laborRates.glosser}
                      onChange={(e) => updateLaborRate('glosser', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">/hr</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Press Operator (per image)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={masterConfig.laborRates.pressOperator}
                      onChange={(e) => updateLaborRate('pressOperator', parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                      step="0.0001"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">/image</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup & Config Tab */}
          {activeTab === 'setup' && (
            <div>
              <h3 className="text-lg font-bold text-brand-indigo mb-4">Setup Costs & Configuration</h3>
              
              <div className="space-y-6">
                {/* Setup Sheets */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Setup Sheets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Extra Sheets per Job
                      </label>
                      <input
                        type="number"
                        value={masterConfig.setupCosts.extraSheetsPerJob}
                        onChange={(e) => updateSetupCost('extraSheetsPerJob', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        min="0"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cleaner Sheets per Job
                      </label>
                      <input
                        type="number"
                        value={masterConfig.setupCosts.cleanerSheetsPerJob}
                        onChange={(e) => updateSetupCost('cleanerSheetsPerJob', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        min="0"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Proof Sheets per Job
                      </label>
                      <input
                        type="number"
                        value={masterConfig.setupCosts.proofsPerJob}
                        onChange={(e) => updateSetupCost('proofsPerJob', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Nexpress Configuration */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Nexpress Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monthly Images
                      </label>
                      <input
                        type="number"
                        value={masterConfig.monthlyImages}
                        onChange={(e) => setMasterConfig({
                          ...masterConfig,
                          monthlyImages: parseInt(e.target.value) || 100000
                        })}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        min="1"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Press Charge (Monthly)
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="number"
                          value={masterConfig.nexpress.pressCharge}
                          onChange={(e) => setMasterConfig({
                            ...masterConfig,
                            nexpress: {
                              ...masterConfig.nexpress,
                              pressCharge: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maintenance (per image)
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="number"
                          value={masterConfig.nexpress.maintenanceContract}
                          onChange={(e) => setMasterConfig({
                            ...masterConfig,
                            nexpress: {
                              ...masterConfig.nexpress,
                              maintenanceContract: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                          step="0.0001"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overhead */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Overhead Settings</h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-w-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Default Overhead Rate (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={masterConfig.facilityOverheads.overheadRate * 100}
                        onChange={(e) => setMasterConfig({
                          ...masterConfig,
                          facilityOverheads: {
                            ...masterConfig.facilityOverheads,
                            overheadRate: (parseFloat(e.target.value) || 0) / 100
                          }
                        })}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t border-gray-300 p-4 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Reset to Defaults
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-brand-gold text-brand-indigo py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
