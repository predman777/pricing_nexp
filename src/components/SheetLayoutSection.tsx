import React, { useState, useEffect } from 'react';

interface SheetLayoutSectionProps {
  onLayoutUpdate?: (piecesPerSheet: number) => void;
  yieldValue: number;
  onYieldUpdate: (yieldValue: number) => void;
}

const SheetLayoutSection: React.FC<SheetLayoutSectionProps> = ({ onLayoutUpdate, yieldValue, onYieldUpdate }) => {
  // Parent sheet dimensions (common commercial sizes - horizontal orientation)
  const [parentWidth, setParentWidth] = useState(19);
  const [parentHeight, setParentHeight] = useState(13);
  
  // Finished piece dimensions
  const [finishedWidth, setFinishedWidth] = useState(4);
  const [finishedHeight, setFinishedHeight] = useState(6);
  
  // Advanced controls - store as strings to allow decimal input
  const [trimMargin, setTrimMargin] = useState(0.25);
  const [gripperMargin, setGripperMargin] = useState(0.25);
  const [horizontalGap, setHorizontalGap] = useState(0.125);
  const [verticalGap, setVerticalGap] = useState(0.125);
  const [forceOrientation, setForceOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  
  // Raw input values for decimal handling
  const [trimMarginInput, setTrimMarginInput] = useState('0.25');
  const [gripperMarginInput, setGripperMarginInput] = useState('0.25');
  const [horizontalGapInput, setHorizontalGapInput] = useState('0.125');
  const [verticalGapInput, setVerticalGapInput] = useState('0.125');
  const [parentWidthInput, setParentWidthInput] = useState('19');
  const [parentHeightInput, setParentHeightInput] = useState('13');
  const [finishedWidthInput, setFinishedWidthInput] = useState('4');
  const [finishedHeightInput, setFinishedHeightInput] = useState('6');
  
  // Manual override for pieces per sheet
  const [manualOverride, setManualOverride] = useState(false);
  const [manualPiecesPerSheet, setManualPiecesPerSheet] = useState(0);
  
  // Show advanced controls
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Layout results
  const [layout, setLayout] = useState({ 
    cols: 0, 
    rows: 0, 
    total: 0, 
    orientation: 'Portrait',
    usedWidth: 0,
    usedHeight: 0,
    wasteWidth: 0,
    wasteHeight: 0,
    wasteArea: 0,
    utilization: 0,
    pieceWidth: 0,
    pieceHeight: 0
  });
  
  // Standard bleeds for commercial printing
  const bleed = 0.125; // .125" bleed
  
  // Helper function to handle decimal input
  const handleDecimalInput = (value: string, setValue: (val: number) => void, setInputValue: (val: string) => void, defaultValue: number) => {
    setInputValue(value);
    
    if (value === '' || value === '.') {
      // Allow empty or just decimal point while typing
      return;
    }
    
    let processedValue = value;
    if (value.startsWith('.')) {
      processedValue = '0' + value;
    }
    
    const num = parseFloat(processedValue);
    if (!isNaN(num) && num >= 0) {
      setValue(num);
    }
  };
  
  const handleDecimalBlur = (value: string, setValue: (val: number) => void, setInputValue: (val: string) => void, defaultValue: number) => {
    if (value === '' || value === '.') {
      setValue(defaultValue);
      setInputValue(defaultValue.toString());
    } else {
      let processedValue = value;
      if (value.startsWith('.')) {
        processedValue = '0' + value;
      }
      const num = parseFloat(processedValue);
      if (isNaN(num) || num < 0) {
        setValue(defaultValue);
        setInputValue(defaultValue.toString());
      } else {
        setInputValue(num.toString());
      }
    }
  };
  
  const calculateLayout = () => {
    // Available area after margins (using trim + gripper margins)
    const availableWidth = parentWidth - (trimMargin * 2);
    const availableHeight = parentHeight - (trimMargin + gripperMargin);
    
    // Finished piece size with bleed
    const pieceWithBleedWidth = finishedWidth + (bleed * 2);
    const pieceWithBleedHeight = finishedHeight + (bleed * 2);
    
    // Calculate finished piece in portrait orientation (as entered)
    const portraitPieceCols = Math.floor((availableWidth + horizontalGap) / (pieceWithBleedWidth + horizontalGap));
    const portraitPieceRows = Math.floor((availableHeight + verticalGap) / (pieceWithBleedHeight + verticalGap));
    const portraitPieceTotal = portraitPieceCols * portraitPieceRows;
    const portraitUsedWidth = portraitPieceCols * pieceWithBleedWidth + (portraitPieceCols - 1) * horizontalGap;
    const portraitUsedHeight = portraitPieceRows * pieceWithBleedHeight + (portraitPieceRows - 1) * verticalGap;
    
    // Calculate finished piece in landscape orientation (rotated 90°)
    const landscapePieceCols = Math.floor((availableWidth + horizontalGap) / (pieceWithBleedHeight + horizontalGap));
    const landscapePieceRows = Math.floor((availableHeight + verticalGap) / (pieceWithBleedWidth + verticalGap));
    const landscapePieceTotal = landscapePieceCols * landscapePieceRows;
    const landscapeUsedWidth = landscapePieceCols * pieceWithBleedHeight + (landscapePieceCols - 1) * horizontalGap;
    const landscapeUsedHeight = landscapePieceRows * pieceWithBleedWidth + (landscapePieceRows - 1) * verticalGap;
    
    // Choose orientation based on user preference or auto-calculate
    let bestLayout;
    const shouldUseLandscape = forceOrientation === 'landscape' || 
      (forceOrientation === 'auto' && landscapePieceTotal > portraitPieceTotal);
    
    if (shouldUseLandscape) {
      // Finished piece runs better rotated (landscape)
      const wasteWidth = availableWidth - landscapeUsedWidth;
      const wasteHeight = availableHeight - landscapeUsedHeight;
      const wasteArea = (wasteWidth * availableHeight) + (landscapeUsedWidth * wasteHeight);
      const utilization = ((landscapePieceTotal * pieceWithBleedHeight * pieceWithBleedWidth) / (availableWidth * availableHeight)) * 100;
      
      bestLayout = {
        cols: landscapePieceCols,
        rows: landscapePieceRows,
        total: landscapePieceTotal,
        orientation: 'Landscape',
        usedWidth: landscapeUsedWidth,
        usedHeight: landscapeUsedHeight,
        wasteWidth,
        wasteHeight,
        wasteArea,
        utilization,
        pieceWidth: pieceWithBleedHeight, // rotated width
        pieceHeight: pieceWithBleedWidth  // rotated height
      };
            } else {
      // Use portrait orientation (forced or better calculated)
      const wasteWidth = availableWidth - portraitUsedWidth;
      const wasteHeight = availableHeight - portraitUsedHeight;
      const wasteArea = (wasteWidth * availableHeight) + (portraitUsedWidth * wasteHeight);
      const utilization = ((portraitPieceTotal * pieceWithBleedWidth * pieceWithBleedHeight) / (availableWidth * availableHeight)) * 100;
      
      bestLayout = {
        cols: portraitPieceCols,
        rows: portraitPieceRows,
        total: portraitPieceTotal,
        orientation: 'Portrait',
        usedWidth: portraitUsedWidth,
        usedHeight: portraitUsedHeight,
        wasteWidth,
        wasteHeight,
        wasteArea,
        utilization,
        pieceWidth: pieceWithBleedWidth,
        pieceHeight: pieceWithBleedHeight
      };
    }
    
    setLayout(bestLayout);
    
    // Use manual override if enabled, otherwise use calculated value
    const effectivePiecesPerSheet = manualOverride ? manualPiecesPerSheet : bestLayout.total;
    console.log('SheetLayoutSection - calling onLayoutUpdate with:', {
      manualOverride,
      manualPiecesPerSheet,
      calculatedTotal: bestLayout.total,
      effectivePiecesPerSheet
    });
    onLayoutUpdate?.(effectivePiecesPerSheet);
  };
  
  useEffect(() => {
    calculateLayout();
  }, [parentWidth, parentHeight, finishedWidth, finishedHeight, manualOverride, manualPiecesPerSheet, 
      trimMargin, gripperMargin, horizontalGap, verticalGap, forceOrientation]);
  
  // Common parent sheet sizes (horizontal orientation as typically fed in press)
  const commonSizes = [
    { name: '11×8.5', width: 11, height: 8.5 },
    { name: '19×13', width: 19, height: 13 },
    { name: '20×14', width: 20, height: 14 }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-brand-indigo mb-4 font-display">Sheet Layout Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Column 1 - Input Controls */}
        <div className="space-y-4">
          {/* Parent Sheet */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm">Parent Sheet Size</h3>
            
            {/* Quick size buttons */}
            <div className="flex flex-wrap gap-1">
              {commonSizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => {
                    setParentWidth(size.width);
                    setParentHeight(size.height);
                  }}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    parentWidth === size.width && parentHeight === size.height
                      ? 'bg-brand-gold text-brand-indigo border-brand-gold font-medium'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size.name}″
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={parentWidthInput}
                  onChange={(e) => handleDecimalInput(e.target.value, setParentWidth, setParentWidthInput, 19)}
                  onBlur={(e) => handleDecimalBlur(e.target.value, setParentWidth, setParentWidthInput, 19)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold"
                  placeholder="19"
                />
                <span className="text-xs text-gray-500">W</span>
              </div>
              <span className="text-xs text-gray-400">×</span>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={parentHeightInput}
                  onChange={(e) => handleDecimalInput(e.target.value, setParentHeight, setParentHeightInput, 13)}
                  onBlur={(e) => handleDecimalBlur(e.target.value, setParentHeight, setParentHeightInput, 13)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold"
                  placeholder="13"
                />
                <span className="text-xs text-gray-500">H</span>
              </div>
            </div>
          </div>
          
          {/* Finished Size */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm">Finished Size</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={finishedWidthInput}
                  onChange={(e) => handleDecimalInput(e.target.value, setFinishedWidth, setFinishedWidthInput, 4)}
                  onBlur={(e) => handleDecimalBlur(e.target.value, setFinishedWidth, setFinishedWidthInput, 4)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold"
                  placeholder="4"
                />
                <span className="text-xs text-gray-500">W</span>
              </div>
              <span className="text-xs text-gray-400">×</span>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={finishedHeightInput}
                  onChange={(e) => handleDecimalInput(e.target.value, setFinishedHeight, setFinishedHeightInput, 6)}
                  onBlur={(e) => handleDecimalBlur(e.target.value, setFinishedHeight, setFinishedHeightInput, 6)}
                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold"
                  placeholder="6"
                />
                <span className="text-xs text-gray-500">H</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              +{trimMargin}″ trim, +{gripperMargin}″ gripper, +0.125″ bleed
            </p>
          </div>
          
          {/* Advanced Controls Toggle */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-brand-indigo font-medium hover:text-brand-gold transition-colors flex items-center"
            >
              {showAdvanced ? '▼' : '▶'} Advanced Controls
            </button>
            
            {showAdvanced && (
              <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
                {/* Margins */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-600">Margins</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Trim</label>
                      <input
                        type="text"
                        value={trimMarginInput}
                        onChange={(e) => handleDecimalInput(e.target.value, setTrimMargin, setTrimMarginInput, 0.25)}
                        onBlur={(e) => handleDecimalBlur(e.target.value, setTrimMargin, setTrimMarginInput, 0.25)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="0.25"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Gripper</label>
                      <input
                        type="text"
                        value={gripperMarginInput}
                        onChange={(e) => handleDecimalInput(e.target.value, setGripperMargin, setGripperMarginInput, 0.25)}
                        onBlur={(e) => handleDecimalBlur(e.target.value, setGripperMargin, setGripperMarginInput, 0.25)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="0.25"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Gaps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-600">Spacing</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">H-Gap</label>
                      <input
                        type="text"
                        value={horizontalGapInput}
                        onChange={(e) => handleDecimalInput(e.target.value, setHorizontalGap, setHorizontalGapInput, 0.125)}
                        onBlur={(e) => handleDecimalBlur(e.target.value, setHorizontalGap, setHorizontalGapInput, 0.125)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="0.125"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">V-Gap</label>
                      <input
                        type="text"
                        value={verticalGapInput}
                        onChange={(e) => handleDecimalInput(e.target.value, setVerticalGap, setVerticalGapInput, 0.125)}
                        onBlur={(e) => handleDecimalBlur(e.target.value, setVerticalGap, setVerticalGapInput, 0.125)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        placeholder="0.125"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Orientation Control */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-1">Cut Orientation</h4>
                  <select
                    value={forceOrientation}
                    onChange={(e) => setForceOrientation(e.target.value as 'auto' | 'portrait' | 'landscape')}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="auto">Auto (Best Fit)</option>
                    <option value="portrait">Force Portrait</option>
                    <option value="landscape">Force Landscape</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Finished Quantity Needed */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm">Finished Quantity Needed</h3>
            <input
              type="number"
              value={yieldValue === 0 ? '' : yieldValue}
              onChange={(e) => onYieldUpdate(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              min="0"
              placeholder="Total pieces needed"
            />
            <p className="text-xs text-gray-500 italic">
              Calculated optimum: {layout.total} pieces per sheet
              {manualOverride && (
                <span className="text-brand-orange font-medium"> (overridden)</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Column 2 - Layout Results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm">Layout Results</h3>
          
          {/* Orientation Comparison */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`p-2 rounded border text-xs ${
              layout.orientation === 'Portrait' ? 'bg-blue-100 border-blue-400 border-l-4' : 'bg-gray-100 border-gray-300'
            }`}>
              <div className="font-medium text-gray-700">Portrait Orientation</div>
              <div className="text-gray-600">
                {Math.floor((parentWidth - trimMargin * 2 + horizontalGap) / (finishedWidth + bleed * 2 + horizontalGap))} cuts 
                ({Math.floor((parentWidth - trimMargin * 2 + horizontalGap) / (finishedWidth + bleed * 2 + horizontalGap))} columns × {Math.floor((parentHeight - trimMargin - gripperMargin + verticalGap) / (finishedHeight + bleed * 2 + verticalGap))} rows)
              </div>
            </div>
            <div className={`p-2 rounded border text-xs ${
              layout.orientation === 'Landscape' ? 'bg-blue-100 border-blue-400 border-l-4' : 'bg-gray-100 border-gray-300'
            }`}>
              <div className="font-medium text-gray-700">Landscape Orientation</div>
              <div className="text-gray-600">
                {Math.floor((parentWidth - trimMargin * 2 + horizontalGap) / (finishedHeight + bleed * 2 + horizontalGap)) * Math.floor((parentHeight - trimMargin - gripperMargin + verticalGap) / (finishedWidth + bleed * 2 + verticalGap))} cuts 
                ({Math.floor((parentWidth - trimMargin * 2 + horizontalGap) / (finishedHeight + bleed * 2 + horizontalGap))} columns × {Math.floor((parentHeight - trimMargin - gripperMargin + verticalGap) / (finishedWidth + bleed * 2 + verticalGap))} rows)
              </div>
            </div>
          </div>
          
          {/* Best Layout Display */}
          <div className="bg-gradient-to-br from-brand-pale-blue to-blue-50 p-4 rounded-lg border border-brand-darker-blue">
            <div className="text-center mb-2">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {forceOrientation === 'auto' ? 'Best Layout' : `Forced ${forceOrientation.charAt(0).toUpperCase() + forceOrientation.slice(1)}`}
              </div>
              <div className="font-bold text-2xl text-brand-indigo">
                {manualOverride ? manualPiecesPerSheet : layout.total} cuts
              </div>
              <div className="text-xs text-gray-600">
                {layout.cols} columns × {layout.rows} rows
              </div>
              <div className="text-xs text-gray-500">
                {layout.orientation} orientation {manualOverride ? '(manual override)' : ''}
              </div>
            </div>
            
            {/* Total Sheets Needed */}
            <div className="border-t border-blue-200 pt-3 text-center">
              <div className="text-sm font-medium text-gray-700">Total Sheets Needed:</div>
              <div className="font-bold text-2xl text-brand-indigo">
                {yieldValue > 0 && (manualOverride ? manualPiecesPerSheet : layout.total) > 0 ? 
                  Math.ceil(yieldValue / (manualOverride ? manualPiecesPerSheet : layout.total)) : 0}
              </div>
              <div className="text-xs text-gray-500">
                {yieldValue > 0 ? `for ${yieldValue.toLocaleString()} pieces` : 'Enter quantity above'}
              </div>
            </div>
          </div>
          
          {/* Manual Override Controls */}
          <div className="bg-gradient-to-br from-brand-pale-gold to-yellow-50 p-4 rounded-lg border-2 border-brand-gold">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="manualOverride"
                checked={manualOverride}
                onChange={(e) => {
                  setManualOverride(e.target.checked);
                  if (e.target.checked && manualPiecesPerSheet === 0) {
                    setManualPiecesPerSheet(layout.total);
                  }
                }}
                className="w-4 h-4 text-brand-gold border-2 border-gray-300 rounded focus:ring-brand-gold"
              />
              <label htmlFor="manualOverride" className="text-sm font-bold text-brand-indigo cursor-pointer">
                Manual Override
              </label>
            </div>
            
            {manualOverride && (
              <div className="space-y-2">
                <input
                  type="number"
                  value={manualPiecesPerSheet === 0 ? '' : manualPiecesPerSheet}
                  onChange={(e) => setManualPiecesPerSheet(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border-2 border-brand-gold rounded-md focus:ring-2 focus:ring-brand-gold bg-white transition-colors font-bold text-center"
                  min="1"
                  placeholder="Custom pieces per sheet"
                />
                <p className="text-xs text-gray-600 text-center">
                  Overriding calculated optimum of <span className="font-medium">{layout.total}</span> pieces per sheet
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Column 3 & 4 - Large Visual Preview */}
        {layout.total > 0 && (
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">
              Visual Preview {manualOverride && manualPiecesPerSheet > 0 && (
                <span className="text-brand-orange font-medium">(Manual: {manualPiecesPerSheet} pieces)</span>
              )}
            </h3>
            
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-4 rounded-lg flex justify-center items-center">
              <div 
                className="border-2 border-red-400 border-dashed relative bg-white flex items-center justify-center shadow-sm"
                style={{
                  width: '400px',
                  height: `${Math.min(400 * (parentHeight / parentWidth), 240)}px`,
                  maxHeight: '240px',
                  minHeight: '100px'
                }}
              >
                {/* Margin area */}
                <div 
                  className="bg-white border border-gray-400 relative flex items-center justify-center"
                  style={{
                    position: 'absolute',
                    top: `${(gripperMargin / parentHeight) * 100}%`,
                    left: `${(trimMargin / parentWidth) * 100}%`,
                    right: `${(trimMargin / parentWidth) * 100}%`,
                    bottom: `${(trimMargin / parentHeight) * 100}%`,
                  }}
                >
                  {/* Centered imposition area */}
                  {layout.total > 0 && (
                    <div
                      className={`border ${manualOverride ? 'bg-yellow-100 border-yellow-400' : 'bg-blue-100 border-blue-300'}`}
                      style={{
                        width: `${(layout.usedWidth / (parentWidth - trimMargin * 2)) * 100}%`,
                        height: `${(layout.usedHeight / (parentHeight - trimMargin - gripperMargin)) * 100}%`
                      }}
                    >
                      {/* Grid of pieces - show manual override or calculated layout */}
                      {manualOverride && manualPiecesPerSheet > 0 ? (
                        // Manual override: show custom number of pieces using calculated layout proportions
                        <div 
                          className="grid gap-px bg-yellow-200 h-full w-full"
                          style={{ 
                            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                            overflow: 'hidden'
                          }}
                        >
                          {Array.from({ length: Math.max(layout.total, manualPiecesPerSheet) }, (_, i) => (
                            <div 
                              key={i} 
                              className={`border flex items-center justify-center ${
                                i < manualPiecesPerSheet 
                                  ? 'bg-yellow-400 border-yellow-600' 
                                  : 'bg-gray-200 border-gray-300 opacity-50'
                              }`}
                            >
                              {i < manualPiecesPerSheet && (
                                <span className="text-xs font-bold text-yellow-900" style={{ fontSize: '9px' }}>
                                  {i + 1}
                                </span>
                              )}
                              {i >= manualPiecesPerSheet && i < layout.total && (
                                <span className="text-xs text-gray-400" style={{ fontSize: '8px' }}>
                                  ×
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Calculated layout: show actual grid layout
                        <div 
                          className="grid gap-px bg-blue-200 h-full w-full"
                          style={{ 
                            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                            overflow: 'hidden'
                          }}
                        >
                          {Array.from({ length: layout.total }, (_, i) => (
                            <div 
                              key={i} 
                              className="bg-blue-400 border border-blue-600 flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-white" style={{ fontSize: '9px' }}>
                                {i + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-3 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 border border-red-400 border-dashed mr-1"></div>
                <span>Parent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white border border-gray-400 mr-1"></div>
                <span>Trim+Grip</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 border mr-1 ${manualOverride ? 'bg-yellow-400 border-yellow-600' : 'bg-blue-400 border-blue-600'}`}></div>
                <span>{manualOverride ? 'Manual' : 'Auto'}</span>
              </div>
            </div>
            
            {/* Utilization Info */}
            {layout.total > 0 && (
              <div className="mt-2 text-center">
                <div className="text-xs text-gray-500">
                  Utilization: {layout.utilization.toFixed(1)}% | 
                  Waste: {((parentWidth * parentHeight) - (layout.usedWidth * layout.usedHeight)).toFixed(2)} sq in
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SheetLayoutSection;
