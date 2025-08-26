// Paper stock types and pricing
export interface PaperStock {
  id: string;
  name: string;
  category: 'cover' | 'text' | 'label' | 'specialty';
  manufacturer: string;
  prices: {
    '8.5x11': number;
    '14x20': number;
  };
  availableSizes?: ('8.5x11' | '14x20')[]; // Optional - if not specified, available for all
  isCustom?: boolean; // Flag for custom paper
}

// Consumables
export interface Consumable {
  id: string;
  name: string;
  category: 'orc' | 'nexglosser' | 'nexpress' | 'consumable';
  costPerSheet: {
    '4/0': number;
    '4/4': number;
  };
}

// Job configuration
export interface JobConfig {
  jobNumber: string;
  description: string;
  customer: string;
  yield: number;
  gloss: 0 | 1;
  selectedPaper: string;
  quantities: {
    '8.5x11': {
      '4/0': number;
      '4/4': number;
    };
    '14x20': {
      '4/0': number;
      '4/4': number;
    };
  };
  sheetsGlossed: number;
  sidesGlossed: 0 | 1 | 2;
  
  // Labor inputs
  prePresTime: number;
  variableDataTime: number;
  binderyTime: number;
  
  // Service options
  outsourcePostal: boolean;
  postalHandlingFee: number;
  postalRate: number;
  
  // Business cards
  businessCards: {
    quantity: number;
    perSheet: number;
    topCoat: boolean;
    sidesGlossed: number;
  };
  
  // Additional services
  mailingList: boolean;
  glosserData: boolean;
  
  // Overhead
  overheadRate: number;
  
  // Profit
  costMultiplier: number;
}

// Calculation results
export interface CalculationResults {
  paperCosts: Array<{
    size: string;
    colors: string;
    quantity: number;
    sheets: number;
    costPerSheet: number;
    totalCost: number;
  }>;
  protectiveCoatingCost: number;
  protectiveCoatingDetails: {
    glossedSheets: number;
    glossedSides: number;
    glossCostPerSheet: number;
    glossTotalCost: number;
    businessCardTopCoat: number;
  };
  consumablesCosts: Array<{
    name: string;
    cost: number;
  }>;
  totalConsumables: number;
  
  laborCosts: {
    prePress: number;
    variableData: number;
    bindery: number;
    nexpress: number;
    glosser: number;
    electrical: number;
    toneService: number;
  };
  
  postalCosts: {
    handling: number;
    postage: number;
  };
  
  businessCardCosts: {
    sheets: number;
    paperCost: number;
    laborCost: number;
    topCoatCost: number;
    total: number;
  };
  
  subtotal: number;
  overhead: number;
  totalCost: number;
  profit: number;
  finalPrice: number;
  costPerPiece: number;
}

// Labor rates from DBF Master
export interface LaborRates {
  pressOperator: number; // per hour
  glosser: number; // per hour  
  bindery: number; // per hour
  prePress: number; // per hour
  variableData: number; // per hour
}

// Master configuration
export interface MasterConfig {
  monthlyImages: number;
  laborRates: LaborRates;
  facilityOverheads: {
    electrical: number;
    toneService: number;
    overheadRate: number;
  };
  nexpress: {
    pressCharge: number;
    maintenanceContract: number;
  };
  setupCosts: {
    extraSheetsPerJob: number;
    cleanerSheetsPerJob: number;
    proofsPerJob: number;
  };
}
