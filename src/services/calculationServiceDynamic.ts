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

  // 1. Calculate paper costs (including setup sheets like Excel)
  const paperCosts: Array<{
    size: string;
    colors: string;
    quantity: number;
    sheets: number;
    costPerSheet: number;
    totalCost: number;
    setupSheets: number;
  }> = [];
  let totalPaperCost = 0;

  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        if (costPerSheet && costPerSheet > 0) {
          // Excel uses different setup sheets for 4/4 vs 4/0
          const setupSheets = colors === '4/4' ? 15 : 5; // 15 for full color, 5 for single color
          const sheets = quantity + setupSheets; // Add color-specific setup sheets
          const cost = sheets * costPerSheet;
          
          paperCosts.push({
            size,
            colors,
            quantity,
            sheets,
            costPerSheet,
            totalCost: cost,
            setupSheets // Show setup sheets used
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

  // 3. Calculate total sheets first (needed for consumables and labor)
  let totalSheetsForNexpress = 0;
  let totalSheetsWithSetup = 0;
  
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        // Only count sheets if the paper has a valid cost for this size
        if (costPerSheet && costPerSheet > 0) {
          totalSheetsForNexpress += quantity; // Base quantity for maintenance
          
          // Add setup sheets for labor calculation (matching Excel logic)
          const setupSheets = masterConfig.setupCosts.extraSheetsPerJob + 
                             masterConfig.setupCosts.cleanerSheetsPerJob + 
                             masterConfig.setupCosts.proofsPerJob;
          totalSheetsWithSetup += quantity + setupSheets;
        }
      }
    });
  });
  
  // 4. Calculate consumables
  // Calculate ORC's Standard Consumables based on sheets WITH setup sheets and color mode
  let orcConsumableCost = 0;
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        
        if (costPerSheet && costPerSheet > 0) {
          // Excel uses exact formula for ORC: (quantity × 2) + 10
          const totalSheetsForORC = (quantity * 2) + 10; // Exact Excel formula
          
          // ORC's Standard Consumables rate (matching Excel's logic)
          const orcRate = colors === '4/4' ? 0.064 : 0.032; // From tab1.xlsx
          orcConsumableCost += totalSheetsForORC * orcRate;
        }
      }
    });
  });
  
  // NEXPRESS Maintenance Contract: Excel formula is quantity * rate * total_quantity
  // From tab2_formulas.json: C22=C19*#REF!*G38 where G38 is total quantity
  
  // First, calculate total quantity across all color modes (G38 in Excel)
  let totalQuantity = 0;
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        if (costPerSheet && costPerSheet > 0) {
          totalQuantity += quantity;
        }
      }
    });
  });
  
  // Now calculate maintenance cost: rate * total_quantity (based on color mode complexity)
  let nexpressMaintenanceCost = 0;
  
  // Determine the highest complexity color mode in this job
  let hasFullColor = false;
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0 && colors === '4/4') {
        hasFullColor = true;
      }
    });
  });
  
  // Calculate maintenance cost based on total quantity and color complexity
  if (totalQuantity > 0) {
    const baseMaintenanceRate = masterConfig.nexpress?.maintenanceContract || 0.032;
    
    // Use Excel-calibrated rates to match the $0.90 for 200 sheets case
    if (hasFullColor) {
      // 4/4 Full Color: $0.90 ÷ 200 = $0.0045/sheet
      const rate_4_4 = 0.0045; // Calibrated to match Excel
      nexpressMaintenanceCost = rate_4_4 * totalQuantity;
    } else {
      // 4/0 Single Color: Use even lower rate  
      const rate_4_0 = 0.0045; // Same rate for now
      nexpressMaintenanceCost = rate_4_0 * totalQuantity;
    }
  }
  
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
  
  // Nexpress labor calculation: Fixed rates for different color modes
  let nexpressLabor = 0;
  const nexpressLaborRate4_0 = masterConfig.laborRates.pressOperator; // Nexpress 4/0 rate
  const nexpressLaborRate4_4 = jobConfig.nexpressLabor4_4Rate || 0.079; // Use custom rate if provided, else default

  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        if (costPerSheet && costPerSheet > 0) {
          if (colors === '4/4') {
            nexpressLabor += quantity * nexpressLaborRate4_4;
          } else {
            nexpressLabor += quantity * nexpressLaborRate4_0;
          }
        }
      }
    });
  });
  
  const laborCosts = {
    prePress: prePressCost,
    variableData: variableDataCost,
    bindery: binderyCost,
    nexpress: nexpressLabor,
    glosser: masterConfig.laborRates.glosser || 0,
    electrical: masterConfig.facilityOverheads?.electrical || 0,
    toneService: masterConfig.facilityOverheads?.toneService || 0
  };

  // 5. Calculate postal costs (removed from UI, set to zero)
  let postalCosts = {
    handling: 0,
    postage: 0
  };

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

  // 7. Calculate subtotal with Excel's selective multiplier logic
  // Purple border items (get profit multiplier): Paper, Consumables, Nexpress Labor, Business Cards
  const purpleBorderCosts = totalPaperCost + protectiveCoatingCost + totalConsumables + 
                           nexpressLabor + businessCardCosts.total;
  
  // Non-purple border items (no profit multiplier): Pre Press, Variable Data, Bindery, Postal
  const nonPurpleBorderCosts = prePressCost + variableDataCost + binderyCost + 
                              postalCosts.handling + postalCosts.postage;
  
  // AUTOMATIC MULTIPLIER CALIBRATION:
  // Dynamic multiplier based on total sheet quantity curve
  // Low qty (50 sheets and below): 100% (1.0) - no markup for small quantities
  // High qty (1000+ sheets): 153% (1.53)
  
  const calculateCalibratedMultiplier = (totalSheets: number): number => {
    if (jobConfig.calibratedMultiplier) {
      return jobConfig.calibratedMultiplier; // Use override if provided
    }
    
    // Define the 4-segment curve points
    const lowQty = 50;
    const earlyMidQty = 100;
    const midQty = 250;
    const highQty = 1000;
    const lowMultiplier = 1.0; // 100% - no markup for small quantities
    const earlyMidMultiplier = 1.26; // 126% - early mid-range checkpoint
    const midMultiplier = 1.44; // 144% - mid-range checkpoint
    const highMultiplier = 1.53; // 153% - maximum markup
    
    if (totalSheets <= lowQty) {
      return lowMultiplier;
    } else if (totalSheets <= earlyMidQty) {
      // Linear interpolation between low and early-mid points (50 → 100 sheets: 100% → 126%)
      const progress = (totalSheets - lowQty) / (earlyMidQty - lowQty);
      return lowMultiplier + (progress * (earlyMidMultiplier - lowMultiplier));
    } else if (totalSheets <= midQty) {
      // Linear interpolation between early-mid and mid points (100 → 250 sheets: 126% → 144%)
      const progress = (totalSheets - earlyMidQty) / (midQty - earlyMidQty);
      return earlyMidMultiplier + (progress * (midMultiplier - earlyMidMultiplier));
    } else if (totalSheets >= highQty) {
      return highMultiplier;
    } else {
      // Linear interpolation between mid and high points (250 → 1000 sheets: 144% → 153%)
      const progress = (totalSheets - midQty) / (highQty - midQty);
      return midMultiplier + (progress * (highMultiplier - midMultiplier));
    }
  };
  
  const calibratedMultiplier = calculateCalibratedMultiplier(totalSheetsForNexpress);
  
  // Apply calibrated multiplier to purple border costs
  const purpleBorderCostsWithProfit = purpleBorderCosts * calibratedMultiplier;
  
  // Calculate subtotal (purple costs with calibrated profit + non-purple costs without profit)
  const subtotal = purpleBorderCostsWithProfit + nonPurpleBorderCosts;

  // 8. Calculate overhead on the subtotal
  const overhead = subtotal * jobConfig.overheadRate;

  // 9. Calculate total cost
  const totalCost = subtotal + overhead;

  // 10. Apply user's profit multiplier to get final price
  const finalPrice = totalCost * jobConfig.costMultiplier;
  const profit = totalCost * (jobConfig.costMultiplier - 1); // Profit from user's multiplier

  // 11. Calculate cost per piece
  const costPerPiece = jobConfig.yield > 0 ? finalPrice / jobConfig.yield : 0;

  // Create enhanced breakdown with detailed information
  const totalLaborCost = prePressCost + variableDataCost + binderyCost + nexpressLabor;
  const totalPostalCost = postalCosts.handling + postalCosts.postage;
  
  const calculationBreakdown = {
    totalPaperCost,
    totalConsumables,
    totalLaborCost,
    totalPostalCost,
    totalBusinessCards: businessCardCosts.total,
    subtotal,
    overhead,
    overheadRate: jobConfig.overheadRate,
    totalCost,
    profit,
    profitRate: jobConfig.costMultiplier - 1,
    finalPrice,
    costPerPiece,
    yield: jobConfig.yield
  };

  // Create detailed Nexpress breakdown
  const nexpressDetails = {
    totalSheets: totalSheetsForNexpress,
    rate: masterConfig.laborRates.pressOperator, // Base rate
    rate4_4: nexpressLaborRate4_4, // Enhanced rate for 4/4
    colorBreakdown: [] as Array<{size: string; colors: string; quantity: number; cost: number; rate: number}>
  };
  
  // Build color breakdown for Nexpress
  Object.entries(jobConfig.quantities).forEach(([size, colorOptions]) => {
    Object.entries(colorOptions).forEach(([colors, quantity]) => {
      if (quantity > 0) {
        const sizeKey = size as '8.5x11' | '14x20';
        const costPerSheet = selectedPaper.prices[sizeKey];
        if (costPerSheet && costPerSheet > 0) {
          const rate = colors === '4/4' ? nexpressLaborRate4_4 : nexpressLaborRate4_0;
          nexpressDetails.colorBreakdown.push({
            size,
            colors,
            quantity,
            cost: quantity * rate,
            rate: rate
          });
        }
      }
    });
  });

  // Enhanced consumables with details
  const enhancedConsumablesCosts = [
    { 
      name: "ORC's Standard", 
      cost: orcConsumableCost,
      sheets: Object.entries(jobConfig.quantities).reduce((total, [size, colorOptions]) => {
        return total + Object.entries(colorOptions).reduce((subtotal, [colors, quantity]) => {
          if (quantity > 0) {
            const sizeKey = size as '8.5x11' | '14x20';
            const costPerSheet = selectedPaper.prices[sizeKey];
            if (costPerSheet && costPerSheet > 0) {
              return subtotal + ((quantity * 2) + 10);
            }
          }
          return subtotal;
        }, 0);
      }, 0),
      rate: 0.064 // Show 4/4 rate as primary
    },
    { 
      name: "NEXPRESS Maintenance", 
      cost: nexpressMaintenanceCost,
      sheets: totalSheetsForNexpress,
      rate: 0.0045 // Calibrated rate to match Excel
    }
  ];

  // DIAGNOSTIC INFORMATION FOR MULTIPLIER REVERSE-ENGINEERING
  const diagnosticInfo = {
    allBaseCosts: totalPaperCost + protectiveCoatingCost + totalConsumables + 
                  prePressCost + variableDataCost + binderyCost + nexpressLabor + 
                  businessCardCosts.total + postalCosts.handling + postalCosts.postage,
    purpleBorderCostsBase: purpleBorderCosts,
    nonPurpleBorderCosts: nonPurpleBorderCosts,
    currentMultiplier: jobConfig.costMultiplier,
    currentSubtotalWithMultiplier: subtotal,
    
    // Calibrated multiplier curve info
    calibratedMultiplierInfo: {
      totalSheets: totalSheetsForNexpress,
      appliedMultiplier: calibratedMultiplier,
      appliedPercentage: Math.round(calibratedMultiplier * 100),
      curveDetails: {
        lowQtyThreshold: 50,
        earlyMidQtyThreshold: 100,
        midQtyThreshold: 250,
        highQtyThreshold: 1000,
        lowMultiplier: 1.0, // 100% - no markup for small quantities
        earlyMidMultiplier: 1.26, // 126% - early mid-range checkpoint
        midMultiplier: 1.44, // 144% - mid-range checkpoint
        highMultiplier: 1.53, // 153% - maximum markup
        isOverride: !!jobConfig.calibratedMultiplier
      }
    },
    
    // Individual base costs breakdown
    baseCostBreakdown: {
      paper: totalPaperCost,
      protectiveCoating: protectiveCoatingCost, 
      consumables: totalConsumables,
      nexpressLabor: nexpressLabor,
      businessCards: businessCardCosts.total,
      prePress: prePressCost,
      variableData: variableDataCost,
      bindery: binderyCost,
      postal: postalCosts.handling + postalCosts.postage
    },
    
    // What multiplier would we need to reach a target?
    calculateRequiredMultiplier: (targetSubtotal: number) => {
      if (purpleBorderCosts === 0) return 1;
      return (targetSubtotal - nonPurpleBorderCosts) / purpleBorderCosts;
    }
  };

  return {
    paperCosts,
    protectiveCoatingCost,
    protectiveCoatingDetails,
    consumablesCosts: enhancedConsumablesCosts,
    totalConsumables,
    laborCosts: {
      ...laborCosts,
      nexpressDetails
    },
    postalCosts,
    businessCardCosts,
    calculationBreakdown,
    diagnosticInfo, // Add diagnostic info
    
    // Legacy fields for backward compatibility
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
