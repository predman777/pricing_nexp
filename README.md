# Commercial Printing Pricing Calculator

A comprehensive web-based pricing calculator for commercial printing jobs built with React, TypeScript, and Vite. This application provides accurate pricing calculations for digital printing including paper costs, consumables, labor, and facility overheads with an intuitive user interface.

## 🎯 Overview

This application was developed to replace and improve upon an existing Excel-based pricing system, ensuring accuracy and ease of use for commercial printing quote generation. It handles complex calculations for various print job configurations while maintaining transparency in cost breakdown.

## ✨ Key Features

### Core Functionality
- **📋 Job Information**: Job number, description, and customer tracking
- **📄 Paper Selection**: Comprehensive paper stock library with real-time pricing
- **📐 Sheet Layout Calculator**: Automatic layout optimization with manual override option
- **💰 Additional Costs**: Bindery and pre-press time tracking with live cost calculation
- **🎨 Color Configuration**: 4/0 and 4/4 color options with automatic quantity population
- **📊 Detailed Cost Breakdown**: Transparent pricing with step-by-step calculations
- **⚙️ Profit Controls**: Configurable overhead rates and final cost multipliers

### Advanced Features
- **Smart Auto-Population**: Automatically populates 4/0 quantities based on sheet layout calculations
- **Manual Override**: Override calculated pieces per sheet for custom layouts
- **Visual Preview**: Real-time visual representation of sheet layouts
- **Calibrated Multiplier**: Volume-based pricing adjustments with detailed explanations
- **Professional Interface**: Clean, emoji-free design for business use

## 🏗️ Application Structure

### Main Sections

#### 1. Job Information (`JobInfoSection.tsx`)
- Job number and description
- Customer information
- Streamlined interface (removed duplicate labor inputs)

#### 2. Sheet Layout Calculator (`SheetLayoutSection.tsx`)
- **Automatic Layout Optimization**: Calculates best fit for piece dimensions on sheet sizes
- **Manual Override**: Option to specify custom pieces per sheet
- **Visual Preview**: Interactive grid showing layout with proper proportions
- **Total Sheets Calculation**: Automatically calculates sheets needed based on yield and layout

#### 3. Paper & Size Selection (`PaperSelectionSection.tsx`)
- **Paper Stock Selection**: Dropdown with comprehensive paper library
- **Custom Paper Option**: User-defined pricing for special stocks
- **Quantity Configuration**: 4/0 and 4/4 quantities with smart auto-population
- **Additional Costs Section**: 
  - Bindery Time (@ $65/hr)
  - Pre Press Time (@ $150/hr)
  - Live cost calculations

#### 4. Cost Breakdown & Results (`CalculationResultsSection.tsx`)
- **Detailed Cost Analysis**:
  - Paper costs (including setup sheets: 5 for 4/0, 15 for 4/4)
  - Consumables (ORC's Standard formula: (quantity × 2) + 10 sheets)
  - Labor breakdown (Nexpress rates: $0.045/sheet for 4/0, $0.079/sheet for 4/4)
  - Business cards (when applicable)
- **Pricing Flow**:
  - Subtotal (before multiplier)
  - Calibrated Multiplier application
  - Subtotal (with multiplier)
  - Overhead (25% facility costs)
  - Final total cost
- **Final Quote Section**:
  - Total cost and cost per piece
  - Final Cost Multiplier (1% increments, 125% default)
  - Profit margin display

## 💡 Key Improvements Made

### User Experience Enhancements
- ✅ **Fixed Auto-Population**: 4/0 quantities now properly auto-populate from sheet calculations
- ✅ **Manual Override System**: Users can override calculated pieces per sheet
- ✅ **Professional Design**: Removed all emoji icons for business-appropriate interface
- ✅ **Improved Input Handling**: Final Cost Multiplier accepts 1% increments and manual entry
- ✅ **Organized Layout**: Moved labor inputs to logical "Additional Costs" section
- ✅ **Hidden Business Cards**: Temporarily hidden until needed

### Technical Improvements
- ✅ **Fixed Infinite Re-render Loop**: Resolved React useEffect dependency issues
- ✅ **Enhanced Cost Transparency**: Detailed breakdown showing all cost components
- ✅ **Calibrated Multiplier Explanation**: Added business logic explanation for volume pricing
- ✅ **Visual Preview Accuracy**: Manual override layouts maintain proper proportions

## 🔧 Technical Architecture

### File Structure
```
src/
├── components/           # React components
│   ├── JobInfoSection.tsx
│   ├── SheetLayoutSection.tsx
│   ├── PaperSelectionSection.tsx
│   ├── CalculationResultsSection.tsx
│   └── PricingCalculator.tsx
├── data/                # Static pricing data
│   └── pricingData.ts
├── services/            # Business logic
│   └── calculationServiceDynamic.ts
├── types/               # TypeScript definitions
│   └── PricingTypes.ts
└── App.tsx              # Main application
```

### Key Technologies
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Custom hooks** for state management

## 📊 Pricing Logic

### Paper Costs
- Uses actual sheet quantities (not yield-derived)
- Includes setup sheets: 5 sheets for 4/0, 15 sheets for 4/4
- Real-time cost calculation based on selected paper stock

### Labor Calculations
- **Nexpress Rates**: $0.045/sheet (4/0), $0.079/sheet (4/4)
- **Pre-press**: $150/hour
- **Bindery**: $65/hour
- **Variable Data**: $95/hour

### Consumables
- **ORC Standard**: Formula-based on quantity: `(quantity × 2) + 10 sheets`
- **Nexpress Maintenance**: $0.032/sheet

### Pricing Flow
1. Calculate base costs (paper, consumables, labor)
2. Apply Calibrated Multiplier (volume-based pricing adjustment)
3. Add Overhead (25% for facility costs, utilities, equipment)
4. Apply Final Cost Multiplier (default 125%, user adjustable)

### Calibrated Multiplier Logic
Volume-based pricing that increases with larger orders to account for:
- Setup and preparation time distribution
- Equipment efficiency optimization
- Quality control requirements
- Resource allocation planning

## 🚀 Installation & Usage

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start
```bash
# Navigate to project directory
cd pricing-calculator

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development Server
- **Local**: http://localhost:3000
- **Hot Reload**: Automatic refresh on file changes
- **TypeScript**: Full type checking and IntelliSense

## 📁 Reference Materials

The `Reference/` folder contains original Excel files and analysis tools used during development:
- **Excel Files**: Original pricing spreadsheets
- **Python Scripts**: Data extraction and analysis tools (legacy)
- **JSON Data**: Extracted pricing data and formulas

*Note: Python analysis tools are archived for reference. All pricing logic is now implemented in TypeScript.*

## 🔄 Recent Updates

### Version 2.0 Features
- **Sheet Layout Calculator**: Automatic optimization with manual override
- **Additional Costs Section**: Centralized labor input under Paper Selection
- **Enhanced Cost Breakdown**: Detailed sub-components and explanations
- **Professional Interface**: Removed decorative elements for business use
- **Improved Input Validation**: Better handling of edge cases and manual entry

### Bug Fixes
- Fixed auto-population of 4/0 quantities from sheet calculations
- Resolved infinite re-render loop in quantity updates
- Fixed Final Cost Multiplier input field behavior
- Corrected visual preview proportions for manual overrides

## 🎛️ Configuration

### Customizing Rates
Edit `src/data/pricingData.ts` to modify:
- Paper stock pricing
- Labor hourly rates
- Consumable costs
- Default overhead percentages

### Business Logic
Modify `src/services/calculationServiceDynamic.ts` for:
- Calculation formulas
- Setup sheet quantities
- Multiplier logic
- Cost categorization

## 📈 Future Enhancements

### Planned Features
- Export functionality for quotes and cost breakdowns
- Admin panel for rate management
- Customer database integration
- Job history and templates
- Advanced reporting and analytics

### Technical Improvements
- Enhanced error handling and validation
- Performance optimizations
- Mobile app version
- Integration with printing equipment APIs

## 🛠️ Development

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Consistent component structure
- Comprehensive type definitions

### Testing Strategy
- Component unit tests
- Calculation accuracy validation
- Cross-browser compatibility testing
- User acceptance testing with print shop operators

## 📞 Support

This application is designed for commercial printing environments and includes:
- Comprehensive cost transparency
- Business-appropriate professional interface
- Accurate calculations matching industry standards
- Intuitive workflow for quote generation

For technical issues or feature requests, refer to the component-specific documentation in the source code or contact the development team.