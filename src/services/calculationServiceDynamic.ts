import { JobConfig, CalculationResults, PaperStock, Consumable, MasterConfig } from '../types/PricingTypes';

interface PricingData {
  paperStocks: PaperStock[];
  consumables: Consumable[];
  masterConfig: MasterConfig;
}

export function calculatePricingWithData(
  jobConfig: JobConfig,
  pricingData: PricingData
): CalculationResults {
  const { paperStocks, consumables, masterConfig } = pricingData;
  
  // Find selected paper stock
  const selectedPaper = paperStocks.find(p => p.id === jobConfig.selectedPaper);
  if (!selectedPaper) {
    throw new Error('Selected paper not found');
  }

  // Helper to get consumable cost
  const getConsumableCost = (name: string): number => {
    const consumable = consumables.find(c => c.name === name);
    if (!consumable) return 0;
    // For now, use 4/4 cost as default (higher cost)
    return consumable.costPerSheet['4/4'] || 0;
  };

  // 1. Calculate paper costs
  const paperCosts: Array<{
    size: string;
    colors: string;
    quantity: number;
    sheets: number;
    costPerSheet: number;
    totalCost: number;
  }> = [];
  let totalPaperCost = 0;

  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        if (costPerSheet && costPerSheet > 0) {
          // Quantities ARE the sheet counts - use them directly for paper costing
          const sheets = quantity; // Quantity IS the sheet count
          const cost = sheets * costPerSheet;
          
          paperCosts.push({
            size,
            colors,
            quantity,
            sheets,
            costPerSheet,
            totalCost: cost
          });
          
          totalPaperCost += cost;
        }
      }
    });
  });

  // 2. Calculate protective coating costs
  let protectiveCoatingCost = 0;
  let protectiveCoatingDetails = {
    glossedSheets: 0,
    glossedSides: 0,
    glossCostPerSheet: 0,
    glossTotalCost: 0,
    businessCardTopCoat: 0
  };

  if (jobConfig.sheetsGlossed > 0 && jobConfig.sidesGlossed > 0) {
    // Using actual formula: =IF(O14>14.25,D19*J19*B91*1.5,D19*J19*B91)
    // Where B91 is gloss cost per side = 0.01
    // For now, using simplified formula without the 14.25 check
    const glossCostPerSide = 0.01; // From Excel data
    const glossCost = jobConfig.sheetsGlossed * jobConfig.sidesGlossed * glossCostPerSide;
    protectiveCoatingCost += glossCost;
    protectiveCoatingDetails = {
      glossedSheets: jobConfig.sheetsGlossed,
      glossedSides: jobConfig.sidesGlossed,
      glossCostPerSheet: glossCostPerSide * jobConfig.sidesGlossed,
      glossTotalCost: glossCost,
      businessCardTopCoat: 0
    };
  }

  // Business card top coat
  if (jobConfig.businessCards.topCoat && jobConfig.businessCards.quantity > 0) {
    const bcSheets = Math.ceil(jobConfig.businessCards.quantity / jobConfig.businessCards.perSheet);
    const glossCostPerSide = 0.01; // From Excel data
    const bcTopCoatCost = bcSheets * jobConfig.businessCards.sidesGlossed * glossCostPerSide;
    protectiveCoatingCost += bcTopCoatCost;
    protectiveCoatingDetails.businessCardTopCoat = bcTopCoatCost;
  }

  // 3. Calculate total sheets first (needed for consumables)
  let totalSheetsForNexpress = 0;
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        // Only count sheets if the paper has a valid cost for this size
        if (costPerSheet && costPerSheet > 0) {
          totalSheetsForNexpress += quantity; // Quantity IS the sheet count
        }
      }
    });
  });
  
  // 4. Calculate consumables
  // Calculate ORC's Standard Consumables based on sheets and color mode
  let orcConsumableCost = 0;
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        if (costPerSheet && costPerSheet > 0) {
          // ORC's Standard Consumables rate
          const orcRate = colors === '4/4' ? 0.064 : 0.032; // From tab1.xlsx
          orcConsumableCost += quantity * orcRate;
        }
      }
    });
  });
  
  // NEXPRESS Maintenance Contract: $0.032 per sheet
  const nexpressMaintenanceCost = totalSheetsForNexpress * (masterConfig.nexpress?.maintenanceContract || 0.032);
  
  const consumablesCosts = [
    { name: "ORC's Standard", cost: orcConsumableCost },
    { name: "NEXPRESS Maintenance", cost: nexpressMaintenanceCost }
  ];
  const totalConsumables = orcConsumableCost + nexpressMaintenanceCost;

  // 5. Calculate labor costs
  const prePressCost = jobConfig.prePresTime * masterConfig.laborRates.prePress;
  const variableDataCost = jobConfig.variableDataTime * masterConfig.laborRates.variableData;
  const binderyCost = jobConfig.binderyTime * masterConfig.laborRates.bindery;
  
  // Use the totalSheetsForNexpress calculated earlier
  const totalSheets = totalSheetsForNexpress;
  
  // Nexpress labor calculation: $0.0450 rate per sheet (based on Excel)
  const nexpressLabor = totalSheets * masterConfig.laborRates.pressOperator;
  
  const laborCosts = {
    prePress: prePressCost,
    variableData: variableDataCost,
    bindery: binderyCost,
    nexpress: nexpressLabor,
    glosser: masterConfig.laborRates.glosser || 0,
    electrical: masterConfig.facilityOverheads?.electrical || 0,
    toneService: masterConfig.facilityOverheads?.toneService || 0
  };

  // 5. Calculate postal costs
  let postalCosts = {
    handling: 0,
    postage: 0
  };

  if (jobConfig.outsourcePostal) {
    postalCosts = {
      handling: jobConfig.postalHandlingFee,
      postage: jobConfig.postalRate * jobConfig.yield
    };
  }

  // 6. Calculate business card costs
  let businessCardCosts = {
    sheets: 0,
    paperCost: 0,
    laborCost: 0,
    topCoatCost: protectiveCoatingDetails.businessCardTopCoat,
    total: 0
  };

  if (jobConfig.businessCards.quantity > 0) {
    const bcSheets = Math.ceil(jobConfig.businessCards.quantity / jobConfig.businessCards.perSheet);
    const bcPaperCost = bcSheets * selectedPaper.prices['8.5x11']; // Business cards use 8.5x11
    // Use a default labor rate for business cards (can be configured later)
    const businessCardLaborPerSheet = 0.50; // Default value
    const bcLaborCost = bcSheets * businessCardLaborPerSheet;
    
    businessCardCosts = {
      sheets: bcSheets,
      paperCost: bcPaperCost,
      laborCost: bcLaborCost,
      topCoatCost: protectiveCoatingDetails.businessCardTopCoat,
      total: bcPaperCost + bcLaborCost + protectiveCoatingDetails.businessCardTopCoat
    };
  }

  // 7. Calculate subtotal
  const totalLaborCost = prePressCost + variableDataCost + binderyCost + nexpressLabor;
  const totalPostalCost = postalCosts.handling + postalCosts.postage;
  const subtotal = totalPaperCost + protectiveCoatingCost + totalConsumables + 
                   totalLaborCost + totalPostalCost + businessCardCosts.total;

  // 8. Calculate overhead
  const overhead = subtotal * jobConfig.overheadRate;

  // 9. Calculate total cost
  const totalCost = subtotal + overhead;

  // 10. Calculate profit and final price
  const profit = totalCost * (jobConfig.costMultiplier - 1);
  const finalPrice = totalCost * jobConfig.costMultiplier;

  // 11. Calculate cost per piece
  const costPerPiece = jobConfig.yield > 0 ? finalPrice / jobConfig.yield : 0;

  return {
    paperCosts,
    protectiveCoatingCost,
    protectiveCoatingDetails,
    consumablesCosts,
    totalConsumables,
    laborCosts,
    postalCosts,
    businessCardCosts,
    subtotal,
    overhead,
    totalCost,
    profit,
    finalPrice,
    costPerPiece
  };
}

// Updated validation function to handle business cards properly
export function validateInputs(jobConfig: JobConfig): string[] {
  const errors: string[] = [];
  
  // Check that at least one quantity is entered (either regular quantities or business cards)
  let hasRegularQuantity = false;
  Object.values(jobConfig.quantities).forEach(sizeOptions => {
    Object.values(sizeOptions).forEach(quantity => {
      if (quantity > 0) hasRegularQuantity = true;
    });
  });
  
  const hasBusinessCardQuantity = jobConfig.businessCards.quantity > 0;
  
  // If there are regular quantities, yield must be greater than 0
  if (hasRegularQuantity && jobConfig.yield <= 0) {
    errors.push('Yield must be greater than 0 when paper quantities are entered');
  }
  
  // Must have at least one type of quantity
  if (!hasRegularQuantity && !hasBusinessCardQuantity) {
    errors.push('At least one quantity must be entered (either paper quantities or business cards)');
  }
  
  if (jobConfig.overheadRate < 0 || jobConfig.overheadRate > 1) {
    errors.push('Overhead rate must be between 0 and 1');
  }
  
  if (jobConfig.costMultiplier < 1) {
    errors.push('Cost multiplier must be at least 1');
  }
  
  return errors;
}
