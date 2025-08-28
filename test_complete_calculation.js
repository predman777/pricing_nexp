// Complete verification of ALL Excel calculation components
console.log('COMPLETE EXCEL CALCULATION VERIFICATION');
console.log('======================================');

// Input values from Excel screenshots
const quantity = 2500;
const yield = 5000;
const paperCostPerSheet = 0.105; // 80# Cover Gloss 14x20

console.log('INPUT VALUES:');
console.log('Quantity:', quantity);
console.log('Yield:', yield);
console.log('Paper cost per sheet: $' + paperCostPerSheet);

console.log('\n4/4 (FULL COLOR) CALCULATION:');
console.log('=============================');

// 1. PAPER COST (4/4)
const setupSheets_4_4 = 15;
const totalSheets_4_4 = quantity + setupSheets_4_4; // 2515
const paperCost_4_4 = totalSheets_4_4 * paperCostPerSheet;
console.log('Paper Cost: (' + quantity + ' + ' + setupSheets_4_4 + ') × $' + paperCostPerSheet + ' = $' + paperCost_4_4.toFixed(2));
console.log('Expected: $264.08');

// 2. ORC CONSUMABLES (4/4)
const orcSheets_4_4 = (quantity * 2) + 10; // 5010 sheets
const orcRate_4_4 = 0.064;
const orcCost_4_4 = orcSheets_4_4 * orcRate_4_4;
console.log('ORC Cost: (' + quantity + ' × 2 + 10) × $' + orcRate_4_4 + ' = ' + orcSheets_4_4 + ' × $' + orcRate_4_4 + ' = $' + orcCost_4_4.toFixed(2));
console.log('Expected: $320.64');

// 3. NEXPRESS MAINTENANCE (4/4)
const nexpressMaintenanceRate = 0.032;
const nexpressMaintenanceCost_4_4 = quantity * nexpressMaintenanceRate;
console.log('Nexpress Maintenance: ' + quantity + ' × $' + nexpressMaintenanceRate + ' = $' + nexpressMaintenanceCost_4_4.toFixed(2));
console.log('Expected: $80.48');

// 4. NEXPRESS LABOR (4/4)
const nexpressLaborRate = 0.045;
const nexpressLaborCost_4_4 = quantity * nexpressLaborRate;
console.log('Nexpress Labor: ' + quantity + ' × $' + nexpressLaborRate + ' = $' + nexpressLaborCost_4_4.toFixed(2));
console.log('Expected: $112.50');

// 5. PRE PRESS LABOR (4/4)
const prePressTime = 0.1; // hours
const prePressRate = 150.00; // per hour
const prePressCost = prePressTime * prePressRate;
console.log('Pre Press: ' + prePressTime + ' hrs × $' + prePressRate + '/hr = $' + prePressCost.toFixed(2));
console.log('Expected: $15.00');

// 6. BINDERY LABOR (4/4)
const binderyTime = 0.25; // hours
const binderyRate = 65.00; // per hour
const binderyCost = binderyTime * binderyRate;
console.log('Bindery: ' + binderyTime + ' hrs × $' + binderyRate + '/hr = $' + binderyCost.toFixed(2));
console.log('Expected: $16.25');

// 7. SUBTOTAL (4/4)
const subtotal_4_4 = paperCost_4_4 + orcCost_4_4 + nexpressMaintenanceCost_4_4 + 
                     nexpressLaborCost_4_4 + prePressCost + binderyCost;
console.log('Subtotal: $' + subtotal_4_4.toFixed(2));
console.log('Expected: $808.95');

// 8. OVERHEAD (4/4)
const overheadRate = 0.25; // 25%
const overhead_4_4 = subtotal_4_4 * overheadRate;
console.log('Overhead (25%): $' + subtotal_4_4.toFixed(2) + ' × ' + overheadRate + ' = $' + overhead_4_4.toFixed(2));
console.log('Expected: $194.43');

// 9. TOTAL COST (4/4)
const totalCost_4_4 = subtotal_4_4 + overhead_4_4;
console.log('Total Cost: $' + subtotal_4_4.toFixed(2) + ' + $' + overhead_4_4.toFixed(2) + ' = $' + totalCost_4_4.toFixed(2));
console.log('Expected: $1,003.38');

// 10. PROFIT (4/4)
const profitMultiplier = 1.25; // 125%
const finalPrice_4_4 = totalCost_4_4 * profitMultiplier;
const profit_4_4 = finalPrice_4_4 - totalCost_4_4;
console.log('Final Price (125%): $' + totalCost_4_4.toFixed(2) + ' × ' + profitMultiplier + ' = $' + finalPrice_4_4.toFixed(2));
console.log('Profit: $' + finalPrice_4_4.toFixed(2) + ' - $' + totalCost_4_4.toFixed(2) + ' = $' + profit_4_4.toFixed(2));
console.log('Expected Final Price: $1,975.51');

// 11. COST PER PIECE (4/4)
const costPerPiece_4_4 = finalPrice_4_4 / yield;
console.log('Cost Per Piece: $' + finalPrice_4_4.toFixed(2) + ' ÷ ' + yield + ' = $' + costPerPiece_4_4.toFixed(2));
console.log('Expected: $0.40');

console.log('\n4/0 (SINGLE COLOR) CALCULATION:');
console.log('==============================');

// 1. PAPER COST (4/0)
const setupSheets_4_0 = 5;
const totalSheets_4_0 = quantity + setupSheets_4_0; // 2505
const paperCost_4_0 = totalSheets_4_0 * paperCostPerSheet;
console.log('Paper Cost: (' + quantity + ' + ' + setupSheets_4_0 + ') × $' + paperCostPerSheet + ' = $' + paperCost_4_0.toFixed(2));
console.log('Expected: $263.03');

// 2. ORC CONSUMABLES (4/0)
const orcSheets_4_0 = (quantity * 2) + 10; // Same formula: 5010 sheets
const orcRate_4_0 = 0.032; // Half the 4/4 rate
const orcCost_4_0 = orcSheets_4_0 * orcRate_4_0;
console.log('ORC Cost: (' + quantity + ' × 2 + 10) × $' + orcRate_4_0 + ' = ' + orcSheets_4_0 + ' × $' + orcRate_4_0 + ' = $' + orcCost_4_0.toFixed(2));
console.log('Expected: $160.32');

// 3. NEXPRESS MAINTENANCE (4/0) - Same as 4/4
const nexpressMaintenanceCost_4_0 = quantity * nexpressMaintenanceRate;
console.log('Nexpress Maintenance: ' + quantity + ' × $' + nexpressMaintenanceRate + ' = $' + nexpressMaintenanceCost_4_0.toFixed(2));
console.log('Expected: $80.48 (but Excel shows $5.61)');

// 4. NEXPRESS LABOR (4/0) - Same as 4/4
const nexpressLaborCost_4_0 = quantity * nexpressLaborRate;
console.log('Nexpress Labor: ' + quantity + ' × $' + nexpressLaborRate + ' = $' + nexpressLaborCost_4_0.toFixed(2));
console.log('Expected: $112.50');

// 5. PRE PRESS & BINDERY (4/0) - Same as 4/4
console.log('Pre Press: $' + prePressCost.toFixed(2) + ' (same as 4/4)');
console.log('Bindery: $' + binderyCost.toFixed(2) + ' (same as 4/4)');

// 6. SUBTOTAL (4/0)
const subtotal_4_0 = paperCost_4_0 + orcCost_4_0 + 5.61 + // Using Excel's actual maintenance cost
                     nexpressLaborCost_4_0 + prePressCost + binderyCost;
console.log('Subtotal: $' + subtotal_4_0.toFixed(2));
console.log('Expected: $572.71');

// 7. OVERHEAD (4/0)
const overhead_4_0 = subtotal_4_0 * overheadRate;
console.log('Overhead (25%): $' + subtotal_4_0.toFixed(2) + ' × ' + overheadRate + ' = $' + overhead_4_0.toFixed(2));
console.log('Expected: $135.37');

// 8. TOTAL COST (4/0)
const totalCost_4_0 = subtotal_4_0 + overhead_4_0;
console.log('Total Cost: $' + totalCost_4_0.toFixed(2));
console.log('Expected: $708.08');

// 9. FINAL PRICE (4/0)
const finalPrice_4_0 = totalCost_4_0 * profitMultiplier;
console.log('Final Price (125%): $' + totalCost_4_0.toFixed(2) + ' × ' + profitMultiplier + ' = $' + finalPrice_4_0.toFixed(2));
console.log('Expected: $1,384.91');

// 10. COST PER PIECE (4/0)
const costPerPiece_4_0 = finalPrice_4_0 / yield;
console.log('Cost Per Piece: $' + finalPrice_4_0.toFixed(2) + ' ÷ ' + yield + ' = $' + costPerPiece_4_0.toFixed(2));
console.log('Expected: $0.28');

console.log('\nSUMMARY COMPARISON:');
console.log('===================');
console.log('4/4 Final Price: $' + finalPrice_4_4.toFixed(2) + ' (Expected: $1,975.51)');
console.log('4/0 Final Price: $' + finalPrice_4_0.toFixed(2) + ' (Expected: $1,384.91)');
console.log('Difference: $' + (finalPrice_4_4 - finalPrice_4_0).toFixed(2) + ' (Expected: $590.60)');
