// Paper stock types and pricing
export interface PaperStock {
  id: string;
  name: string;
  category: 'cover' | 'text' | 'label' | 'specialty';
  manufacturer: string;
  prices: {
    '8.5x11': number;
    '13x20': number;
    '14x20': number;
  };
  availableSizes?: ('8.5x11' | '13x20' | '14x20')[]; // Optional - if not specified, available for all
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
  customerEmail: string;
  yield: number;
  gloss: 0 | 1;
  selectedPaper: string;
  quantities: {
    '8.5x11': {
      '4/0': number;
      '4/4': number;
    };
    '13x20': {
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
  
  
  // Business cards
  businessCards: {
    quantity: number;
    perSheet: number;
    topCoat: boolean;
    sidesGlossed: number;
  };
  
  
  // Overhead
  overheadRate: number;
  
  // Profit
  costMultiplier: number;
  calibratedMultiplier?: number; // Behind-the-scenes multiplier for purple border items
  nexpressLabor4_4Rate?: number; // Editable 4/4 Nexpress labor rate per sheet
}

// Diagnostic information for multiplier calibration
export interface DiagnosticInfo {
  allBaseCosts: number;
  purpleBorderCostsBase: number;
  nonPurpleBorderCosts: number;
  currentMultiplier: number;
  currentSubtotalWithMultiplier: number;
  
  // Calibrated multiplier curve information
  calibratedMultiplierInfo: {
    totalSheets: number;
    appliedMultiplier: number;
    appliedPercentage: number;
    curveDetails: {
      lowQtyThreshold: number;
      highQtyThreshold: number;
      lowMultiplier: number;
      highMultiplier: number;
      isOverride: boolean;
    };
  };
  
  baseCostBreakdown: {
    paper: number;
    protectiveCoating: number;
    consumables: number;
    nexpressLabor: number;
    businessCards: number;
    prePress: number;
    variableData: number;
    bindery: number;
    postal: number;
  };
  calculateRequiredMultiplier: (targetSubtotal: number) => number;
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
    setupSheets: number; // Show setup sheets used
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
    sheets?: number; // Show sheets used for calculation
    rate?: number;   // Show rate used
  }>;
  totalConsumables: number;
  
  laborCosts: {
    prePress: number;
    variableData: number;
    bindery: number;
    nexpress: number;
    nexpressDetails?: { // Detailed Nexpress breakdown
      totalSheets: number;
      rate: number;
      colorBreakdown: Array<{
        size: string;
        colors: string;
        quantity: number;
        cost: number;
      }>;
    };
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
  
  // Enhanced totals with more detail
  calculationBreakdown: {
    totalPaperCost: number;
    totalConsumables: number;
    totalLaborCost: number;
    totalPostalCost: number;
    totalBusinessCards: number;
    subtotal: number;
    overhead: number;
    overheadRate: number;
    totalCost: number;
    profit: number;
    profitRate: number;
    finalPrice: number;
    costPerPiece: number;
    yield: number;
  };
  
  // Diagnostic information
  diagnosticInfo?: DiagnosticInfo;
  
  // Legacy fields for backward compatibility
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
  // New configuration sections
  protectiveCoating: {
    glossCostPerSide: number;
    glosserWebCost: number;
    pressureRollerCost: number;
    cleaningPadsCost: number;
    expectedLifeGlosserWeb: number;
    expectedLifePressureRoller: number;
    expectedLifeCleaningPads: number;
  };
  businessCards: {
    defaultPerSheet: number;
    laborCostPerSheet: number;
  };
  postalServices: {
    defaultHandlingFee: number;
    defaultPostalRate: number;
  };
  profitSettings: {
    defaultCostMultiplier: number;
  };
}
