import { useState, useEffect } from 'react';
import { PaperStock, Consumable, MasterConfig } from '../types/PricingTypes';
import { 
  paperStocks as defaultPaperStocks, 
  consumables as defaultConsumables, 
  masterConfig as defaultMasterConfig 
} from '../data/pricingData';

interface PricingData {
  paperStocks: PaperStock[];
  consumables: Consumable[];
  masterConfig: MasterConfig;
}

/**
 * Custom hook to manage pricing data with localStorage persistence
 */
export const usePricingData = () => {
  const [pricingData, setPricingData] = useState<PricingData>({
    paperStocks: defaultPaperStocks,
    consumables: defaultConsumables,
    masterConfig: defaultMasterConfig
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedData = loadPricingData();
    setPricingData(loadedData);
  }, []);

  /**
   * Load pricing data from localStorage or use defaults
   */
  const loadPricingData = (): PricingData => {
    const savedData = localStorage.getItem('pricingData');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          paperStocks: parsed.paperStocks || defaultPaperStocks,
          consumables: parsed.consumables || defaultConsumables,
          masterConfig: parsed.masterConfig || defaultMasterConfig
        };
      } catch (error) {
        console.error('Error loading pricing data:', error);
      }
    }
    
    return {
      paperStocks: defaultPaperStocks,
      consumables: defaultConsumables,
      masterConfig: defaultMasterConfig
    };
  };

  /**
   * Update pricing data and save to localStorage
   */
  const updatePricingData = (newData: PricingData) => {
    setPricingData(newData);
    localStorage.setItem('pricingData', JSON.stringify(newData));
  };

  /**
   * Get a specific paper stock by ID
   */
  const getPaperStock = (id: string): PaperStock | undefined => {
    return pricingData.paperStocks.find(stock => stock.id === id);
  };

  /**
   * Get a specific consumable by ID
   */
  const getConsumable = (id: string): Consumable | undefined => {
    return pricingData.consumables.find(consumable => consumable.id === id);
  };

  return {
    ...pricingData,
    updatePricingData,
    getPaperStock,
    getConsumable,
    loadPricingData
  };
};
