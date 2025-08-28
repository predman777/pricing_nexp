# Pricing Calculator Application

A comprehensive web-based pricing calculator for print jobs using React, TypeScript, and Vite. This application calculates accurate pricing for digital printing jobs including paper costs, consumables, labor, and facility overheads.

## Overview

This application was developed to match pricing calculations from an existing Excel-based system, ensuring accuracy in:
- Paper cost calculations using actual sheet quantities
- Nexpress labor calculations based on sheet count (not yield-derived)
- ORC consumables with proper 4/0 and 4/4 color rates
- Press operator labor, maintenance contracts, and facility overheads
- 25% overhead rate and configurable profit margins

## Features

### Core Functionality
- **Paper Selection**: Choose from various paper stocks (cover, text, label, specialty)
- **Quantity Input**: Enter quantities for 8.5x11 and 14x20 sizes in 4/0 and 4/4 color modes
- **Labor Calculations**: Pre-press, variable data, bindery, and Nexpress press operator labor
- **Consumables**: ORC standard consumables and Nexpress maintenance contracts
- **Business Cards**: Separate pricing for business card orders with top coat options
- **Services**: Postal handling, outsource services, and glosser operations
- **Profit Calculation**: Configurable overhead rates and cost multipliers

### Key Components

#### 1. Job Info Section (`JobInfoSection.tsx`)
- Job number, description, customer fields
- Yield input (final quantity expected)
- Gloss setting (0 or 1)

#### 2. Paper Selection Section (`PaperSelectionSection.tsx`)
- Dropdown selection of available papers
- Custom paper option with user-defined pricing
- Real-time cost calculation display

#### 3. Labor Section (`LaborSection.tsx`)
- Pre-press time input (hours)
- Variable data development time
- Bindery time requirements
- **Nexpress labor calculation**: Uses actual sheet quantities, not yield-derived sheets
- Glosser operation inputs

#### 4. Services Section (`ServicesSection.tsx`)
- Business card quantity and specifications
- Postal service options
- Outsource service configurations

#### 5. Calculation Results Section (`CalculationResultsSection.tsx`)
- Detailed cost breakdown
- Paper costs, consumables, labor costs
- Overhead and profit calculations
- Final pricing and cost per piece

## Technical Architecture

### File Structure
```
src/
├── components/           # React components
├── data/                # Static pricing data
├── hooks/               # Custom React hooks
├── services/            # Business logic and calculations
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

### Key Files

#### Data Layer
- `src/data/pricingData.ts`: Paper stocks, consumables, labor rates, and master configuration
- `src/types/PricingTypes.ts`: TypeScript interfaces for type safety

#### Business Logic
- `src/services/calculationServiceDynamic.ts`: Core pricing calculations
- Handles paper costing, consumables, labor, overhead, and profit calculations
- **Important**: Uses quantities directly as sheet counts for Nexpress labor calculations

#### Components
- Modular React components for each section of the calculator
- Real-time updates using React hooks
- Responsive design with Tailwind CSS

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Paper Stocks
Paper pricing is configured in `src/data/pricingData.ts`. Each paper has:
- Name and category classification
- Pricing for 8.5x11 and 14x20 sizes
- Available size restrictions
- Custom paper option for user-defined pricing

### Labor Rates
Labor rates are based on Excel reference data:
- **Press Operator**: $0.045 per sheet ($4,500/month ÷ 100,000 images)
- **Pre-press**: $150/hour
- **Variable Data**: $95/hour
- **Bindery**: $65/hour
- **Glosser**: $0.30/hour

### Consumables
- **ORC Standard**: $0.032 per sheet (4/0), $0.064 per sheet (4/4)
- **Nexpress Maintenance**: $0.032 per sheet

### Facility Overheads
- **Overhead Rate**: 25% of subtotal
- **Press Charge**: $3,200/month (calculated per image)
- Electrical and T-1 service costs

## Key Calculation Logic

### Sheet Count vs. Yield
**Critical Implementation Detail**: The application distinguishes between:
- **Quantities**: Actual sheets run through the press (used for labor and some consumables)
- **Yield**: Final delivered quantity (used for cost-per-piece calculations)

For Nexpress labor calculations, the app uses the actual quantity input as sheet count, ensuring accuracy with user expectations.

### Paper Cost Calculation
```typescript
// Uses quantities directly for paper costing
const sheets = quantity; // Quantity IS the sheet count
const cost = sheets * costPerSheet;
```

### Labor Cost Calculation
```typescript
// Nexpress labor uses total sheets from all sizes/colors
const nexpressLabor = totalSheets * pressOperatorRate; // $0.045 per sheet
```

## Testing & Validation

### Reference Test Case
Based on Excel reference data:
- Job #: 1111
- Yield: 1000
- Paper: 100# Cover Gloss
- Quantity: 100 sheets (8.5x11, 4/0)
- Expected costs align with Excel calculations

### Known Issues & Improvements
- **Status**: Still being perfected to match Excel results exactly
- Paper selection dropdown may need refinement
- Additional consumables may need to be added
- Glosser calculations may need fine-tuning

## Excel Reference Integration

This application was built to match an existing Excel-based pricing system:
- `Reference/tab1.xlsx`: Master pricing data and rates
- `Reference/tab-2-only.xlsx`: Sample calculation for validation
- Key rates and formulas extracted and implemented in TypeScript

## Development Notes

### Recent Changes
- Fixed TypeScript compilation errors for consumable categories
- Implemented direct quantity usage for Nexpress labor (not yield-derived)
- Added comprehensive paper stock library with Excel-based pricing
- Integrated 25% overhead rate and configurable profit margins

### Future Enhancements
- Enhanced paper selection UI/UX
- Additional consumables and services
- Improved validation and error handling
- Export functionality for quotes
- Admin panel for rate management

## Support & Maintenance

This application is designed to be maintainable and extensible:
- Type-safe with comprehensive TypeScript interfaces
- Modular component architecture
- Centralized pricing data configuration
- Clear separation between UI and business logic

For modifications to pricing data, rates, or calculations, refer to:
- `src/data/pricingData.ts` for base rates and paper pricing
- `src/services/calculationServiceDynamic.ts` for calculation logic
- `src/types/PricingTypes.ts` for type definitions
