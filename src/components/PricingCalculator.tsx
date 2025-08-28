import React, { useState, useEffect } from 'react';
import { JobConfig, CalculationResults, PaperStock, Consumable, MasterConfig } from '../types/PricingTypes';
import { paperStocks as defaultPaperStocks, consumables as defaultConsumables, masterConfig as defaultMasterConfig } from '../data/pricingData';
import { validateInputs, calculatePricingWithData } from '../services/calculationServiceDynamic';
import JobInfoSection from './JobInfoSection';
import PaperSelectionSection from './PaperSelectionSection';
import LaborSection from './LaborSection';
import CalculationResultsSection from './CalculationResultsSection';
import CustomPaperModal, { CustomPaperData } from './CustomPaperModal';
import SheetLayoutSection from './SheetLayoutSection';

interface PricingCalculatorProps {
  pricingData: {
    paperStocks: PaperStock[];
    consumables: Consumable[];
    masterConfig: MasterConfig;
  };
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ pricingData }) => {
  // Use provided data or fall back to defaults
  const [localPaperStocks, setLocalPaperStocks] = useState<PaperStock[]>(pricingData?.paperStocks || defaultPaperStocks);
  const consumables = pricingData?.consumables || defaultConsumables;
  const masterConfig = pricingData?.masterConfig || defaultMasterConfig;
  const [showCustomPaperModal, setShowCustomPaperModal] = useState(false);
  const [customPapers, setCustomPapers] = useState<PaperStock[]>([]);
  
  // Combine default papers with custom papers
  const paperStocks = [...localPaperStocks, ...customPapers];
  // Initialize job configuration with defaults
  const [jobConfig, setJobConfig] = useState<JobConfig>({
    jobNumber: '',
    description: '',
    customer: '',
    yield: 0,
    gloss: 0,
    selectedPaper: paperStocks[0].id,
    quantities: {
      '8.5x11': { '4/0': 0, '4/4': 0 },
      '13x20': { '4/0': 0, '4/4': 0 },
      '14x20': { '4/0': 0, '4/4': 0 }
    },
    sheetsGlossed: 0,
    sidesGlossed: 0,
    prePresTime: 0.1,
    variableDataTime: 0,
    binderyTime: 0.25,
    businessCards: {
      quantity: 0,
      perSheet: 30,
      topCoat: false,
      sidesGlossed: 0
    },
    overheadRate: 0.25,
    costMultiplier: 1.25
    // calibratedMultiplier will use automatic curve unless overridden
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [layoutInfo, setLayoutInfo] = useState({
    parentSheetSize: '13×20',
    piecesPerSheet: 0,
    totalSheetsNeeded: 0
  });
  
  // Load saved custom papers from localStorage
  useEffect(() => {
    const savedCustomPapers = localStorage.getItem('customPapers');
    if (savedCustomPapers) {
      setCustomPapers(JSON.parse(savedCustomPapers));
    }
  }, []);
  
  // Watch for custom paper selection
  useEffect(() => {
    const selectedPaper = paperStocks.find(p => p.id === jobConfig.selectedPaper);
    if (selectedPaper?.isCustom && !showCustomPaperModal) {
      setShowCustomPaperModal(true);
    }
  }, [jobConfig.selectedPaper, paperStocks, showCustomPaperModal]);

  // Calculate total sheets needed whenever yield or pieces per sheet changes
  useEffect(() => {
    const totalSheets = jobConfig.yield > 0 && layoutInfo.piecesPerSheet > 0 
      ? Math.ceil(jobConfig.yield / layoutInfo.piecesPerSheet) 
      : 0;
    
    if (totalSheets !== layoutInfo.totalSheetsNeeded) {
      setLayoutInfo(prev => ({
        ...prev,
        totalSheetsNeeded: totalSheets
      }));
    }
  }, [jobConfig.yield, layoutInfo.piecesPerSheet, layoutInfo.totalSheetsNeeded]);

  // Calculate results whenever jobConfig or pricing data changes
  useEffect(() => {
    performCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobConfig, pricingData]);

  const performCalculation = () => {
    // Validate inputs
    const errors = validateInputs(jobConfig);
    
    if (errors.length > 0) {
      // For now, just clear results if there are errors
      // You could also display these errors in the UI
      setResults(null);
      return;
    }
    
    try {
      // Use the dynamic calculation service with pricing data
      const calculationResults = calculatePricingWithData(jobConfig, {
        paperStocks,
        consumables,
        masterConfig
      });
      setResults(calculationResults);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
    }
  };

  const updateJobConfig = (updates: Partial<JobConfig>) => {
    setJobConfig(prev => ({ ...prev, ...updates }));
  };
  
  const handleCustomPaperSave = (customPaperData: CustomPaperData) => {
    // Find the custom paper in our list and update it
    const customPaperIndex = localPaperStocks.findIndex(p => p.id === 'custom-paper');
    if (customPaperIndex !== -1) {
      const updatedPaperStocks = [...localPaperStocks];
      updatedPaperStocks[customPaperIndex] = {
        ...updatedPaperStocks[customPaperIndex],
        name: customPaperData.name || 'Custom Paper',
        prices: customPaperData.prices
      };
      setLocalPaperStocks(updatedPaperStocks);
      
      // If user wants to save this as a reusable custom paper
      if (customPaperData.saveToList && customPaperData.name) {
        const newCustomPaper: PaperStock = {
          id: `custom-${Date.now()}`,
          name: `${customPaperData.weight ? customPaperData.weight + ' ' : ''}${customPaperData.name}`,
          category: customPaperData.type || 'specialty',
          manufacturer: 'Custom',
          prices: customPaperData.prices,
          availableSizes: ['8.5x11', '13x20', '14x20']
        };
        
        const updatedCustomPapers = [...customPapers, newCustomPaper];
        setCustomPapers(updatedCustomPapers);
        
        // Save to localStorage
        localStorage.setItem('customPapers', JSON.stringify(updatedCustomPapers));
      }
    }
    
    // Close the modal after saving
    setShowCustomPaperModal(false);
  };
  
  const handleCustomPaperClose = () => {
    setShowCustomPaperModal(false);
    // If user closes without saving, switch back to the first paper
    const selectedPaper = paperStocks.find(p => p.id === jobConfig.selectedPaper);
    if (selectedPaper?.isCustom && selectedPaper.prices['8.5x11'] === 0 && selectedPaper.prices['13x20'] === 0 && selectedPaper.prices['14x20'] === 0) {
      updateJobConfig({ selectedPaper: paperStocks[0]?.id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-pale-blue via-white to-brand-pale-gold">
      {/* Header */}
      <div className="bg-brand-indigo shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white font-display">
              TPS Printing Calculator
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-brand-gold font-semibold">v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Job Information */}
          <JobInfoSection 
            jobConfig={jobConfig}
            onUpdate={updateJobConfig}
          />

          {/* Sheet Layout Calculator */}
          <SheetLayoutSection 
            yieldValue={jobConfig.yield}
            onYieldUpdate={(yieldValue) => updateJobConfig({ yield: yieldValue })}
            onLayoutUpdate={(piecesPerSheet: number) => {
              setLayoutInfo(prev => ({
                ...prev,
                piecesPerSheet
              }));
            }}
          />

          {/* Paper Selection and Quantities */}
          <PaperSelectionSection
            jobConfig={jobConfig}
            onUpdate={updateJobConfig}
            paperStocks={paperStocks}
            parentSheetSize={layoutInfo.parentSheetSize}
            totalSheetsNeeded={layoutInfo.totalSheetsNeeded}
            piecesPerSheet={layoutInfo.piecesPerSheet}
          />

          {/* Labor Section - Removed from UI, calculations handled in background */}
          {/* Services Section - Removed from UI, overhead rate is fixed at 25% */}

          {/* Calculation Results */}
          <CalculationResultsSection
            results={results}
            jobConfig={jobConfig}
            onUpdate={updateJobConfig}
          />
        </div>
      </div>
      
      {/* Custom Paper Modal */}
      <CustomPaperModal
        isOpen={showCustomPaperModal}
        onClose={handleCustomPaperClose}
        onSave={handleCustomPaperSave}
        currentPrices={paperStocks.find(p => p.id === 'custom-paper')?.prices}
      />
    </div>
  );
};

export default PricingCalculator;
