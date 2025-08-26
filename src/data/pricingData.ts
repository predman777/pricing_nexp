import { PaperStock, Consumable, MasterConfig, LaborRates } from '../types/PricingTypes';

// Paper stocks from DBF Master (extracted from tab1.xlsx)
export const paperStocks: PaperStock[] = [
  {
    id: '80-cover-gloss',
    name: '80# Cover Gloss',
    category: 'cover',
    manufacturer: 'Pacesetter',
    prices: {
      '8.5x11': 0.400,  // Confirmed from DBF Master
      '14x20': 0.105   // Confirmed from DBF Master
    },
    availableSizes: ['8.5x11', '14x20'] // Available for both sizes
  },
  {
    id: '100-cover-10pt-gloss',
    name: '100# Cover / 10pt Gloss',
    category: 'cover',
    manufacturer: 'Pacesetter',
    prices: {
      '8.5x11': 0.059,
      '14x20': 0.135
    },
    availableSizes: ['8.5x11', '14x20']
  },
  {
    id: '50-text-offset',
    name: '50# Text Offset',
    category: 'text',
    manufacturer: 'Boise',
    prices: {
      '8.5x11': 0.030,
      '14x20': 0.049
    },
    availableSizes: ['8.5x11', '14x20']
  },
  {
    id: '80-text-gloss',
    name: '80# Text Gloss',
    category: 'text',
    manufacturer: 'Pacesetter',
    prices: {
      '8.5x11': 0.040,
      '14x20': 0.057
    },
    availableSizes: ['8.5x11', '14x20']
  },
  {
    id: '100-text-gloss',
    name: '100# Text Gloss',
    category: 'text',
    manufacturer: 'Pacesetter',
    prices: {
      '8.5x11': 0.040,
      '14x20': 0.069
    },
    availableSizes: ['8.5x11', '14x20']
  },
  {
    id: '70-solar-white',
    name: '70# Solar White',
    category: 'specialty',
    manufacturer: 'Classic Crest',
    prices: {
      '8.5x11': 0.100,
      '14x20': 0.000  // Greyed out in Excel screenshot
    },
    availableSizes: ['8.5x11'] // Only 8.5x11 available based on screenshot
  },
  {
    id: '111-12pt-gloss',
    name: '111# / 12pt Gloss',
    category: 'cover',
    manufacturer: 'Top Kote',
    prices: {
      '8.5x11': 0.000,  // Greyed out in Excel screenshot
      '14x20': 0.165
    },
    availableSizes: ['14x20'] // Only 14x20 available based on screenshot
  },
  {
    id: '80-text-dull',
    name: '80# Text Dull',
    category: 'text',
    manufacturer: 'Titan Dull',
    prices: {
      '8.5x11': 0.000, // Not available
      '14x20': 0.078
    },
    availableSizes: ['14x20'] // Only available in 14x20
  },
  {
    id: '60-label-gloss',
    name: '60# Label Stock Gloss',
    category: 'label',
    manufacturer: '',
    prices: {
      '8.5x11': 0.000, // All greyed out in Excel screenshot
      '14x20': 0.000  // All greyed out in Excel screenshot
    },
    availableSizes: [] // Not available in any size based on screenshot
  },
  {
    id: '60-label-satin',
    name: '60# Label Stock Satin',
    category: 'label',
    manufacturer: '',
    prices: {
      '8.5x11': 0.000, // All greyed out in Excel screenshot
      '14x20': 0.000  // All greyed out in Excel screenshot
    },
    availableSizes: [] // Not available in any size based on screenshot
  },
  {
    id: '60-label-flat',
    name: '60# Label Stock Flat',
    category: 'label',
    manufacturer: '',
    prices: {
      '8.5x11': 0.000, // All greyed out in Excel screenshot
      '14x20': 0.000  // All greyed out in Excel screenshot
    },
    availableSizes: [] // Not available in any size based on screenshot
  },
  {
    id: 'custom-paper',
    name: 'Custom Paper',
    category: 'specialty',
    manufacturer: 'User Defined',
    prices: {
      '8.5x11': 0.000,
      '14x20': 0.000
    },
    availableSizes: ['8.5x11', '14x20'], // Available for all sizes
    isCustom: true
  }
];

// Press Consumables (from DBF Master tab1.xlsx)
export const consumables: Consumable[] = [
  {
    id: 'orc-standard',
    name: "ORC's",  // Simplified name from DBF Master
    category: 'orc',
    costPerSheet: {
      '4/0': 0.032,  // Confirmed from DBF Master row 18
      '4/4': 0.064   // Confirmed from DBF Master row 18
    }
  },
  {
    id: 'uv-gloss',
    name: 'UV Gloss',
    category: 'consumable',
    costPerSheet: {
      '4/0': 0.000,
      '4/4': 0.000
    }
  },
  {
    id: 'toner',
    name: 'Toner',
    category: 'consumable',
    costPerSheet: {
      '4/0': 0.000,
      '4/4': 0.000
    }
  },
  {
    id: 'image',
    name: 'Image',
    category: 'consumable',
    costPerSheet: {
      '4/0': 0.000,
      '4/4': 0.000
    }
  },
  {
    id: 'maintenance',
    name: 'Maintanance', // Keep misspelling to match Excel
    category: 'consumable',
    costPerSheet: {
      '4/0': 0.000,
      '4/4': 0.000
    }
  },
  {
    id: 'waste',
    name: 'Waste',
    category: 'consumable',
    costPerSheet: {
      '4/0': 0.000,
      '4/4': 0.000
    }
  }
];

// Labor rates (converted to hourly from monthly where needed)
export const laborRates: LaborRates = {
  pressOperator: 0.0450, // $4,500/month ÷ 100,000 images
  glosser: 0.3000, // Rate per hour from image
  bindery: 65.00, // $65/hour
  prePress: 150.00, // $150/hour
  variableData: 95.00 // $95/hour
};

// Master configuration
export const masterConfig: MasterConfig = {
  monthlyImages: 100000,
  laborRates: laborRates,
  facilityOverheads: {
    electrical: 0.000, // Calculated based on monthly
    toneService: 0.000, // Calculated based on monthly
    overheadRate: 0.25 // 25%
  },
  nexpress: {
    pressCharge: 3200.00, // $3,200 monthly
    maintenanceContract: 0.0320 // per image
  },
  setupCosts: {
    extraSheetsPerJob: 15,
    cleanerSheetsPerJob: 10,
    proofsPerJob: 5
  }
};

// NEXGlosser Consumables (with expected life calculations)
export const nexGlosserConsumables = {
  fussingBelt: {
    name: 'Glosser Web (Fusing Belt)',
    expectedLife: 150000, // sheets for 8.5x11
    costPerUnit: 0.000 // To be calculated
  },
  glosserWeb: {
    name: 'Glosser Web',
    expectedLife: 150000, // sheets
    costPerSheet: 0.000 // To be calculated
  },
  pressureRoller: {
    name: 'Glosser Pressure Roller',
    expectedLife: 160000, // sheets for 8.5x11
    costPerSheet: 0.000 // To be calculated
  },
  cleaningPads: {
    name: 'Glosser Cleaning Pads (4 Pack)',
    expectedLife: 200000, // sheets for 8.5x11
    costPerSheet: 0.000 // To be calculated
  }
};
