import React, { useState, useEffect } from 'react';

interface BreakpointInfo {
  name: string;
  minWidth: number;
  description: string;
  deviceExamples: string[];
}

const BREAKPOINTS: BreakpointInfo[] = [
  {
    name: 'Mobile (Portrait)',
    minWidth: 0,
    description: 'Small screens, single column layout',
    deviceExamples: ['iPhone SE', 'Galaxy S8', 'Small phones']
  },
  {
    name: 'Mobile (Landscape)',
    minWidth: 640,
    description: 'Larger mobile screens, still single column',
    deviceExamples: ['iPhone 12 Pro', 'Galaxy S21', 'Large phones']
  },
  {
    name: 'Tablet',
    minWidth: 768,
    description: 'Medium screens, may start multi-column',
    deviceExamples: ['iPad Mini', 'Surface Go', 'Small tablets']
  },
  {
    name: 'Desktop',
    minWidth: 1024,
    description: 'Large screens, full three-column layout',
    deviceExamples: ['iPad Pro', 'Laptops', 'Desktop monitors']
  },
  {
    name: 'Large Desktop',
    minWidth: 1280,
    description: 'Extra large screens, optimized spacing',
    deviceExamples: ['Large monitors', '4K displays', 'Ultrawide screens']
  }
];

const ResponsiveTestSuite: React.FC = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointInfo>(BREAKPOINTS[0]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });

      // Determine current breakpoint
      const breakpoint = BREAKPOINTS
        .slice()
        .reverse()
        .find(bp => width >= bp.minWidth) || BREAKPOINTS[0];
      
      setCurrentBreakpoint(breakpoint);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const testComponents = [
    {
      name: 'Main Grid Layout',
      element: 'lifesync-grid-main',
      checks: [
        'Single column on mobile (<1024px)',
        'Three columns on desktop (≥1024px)',
        'Proper gap spacing between cards',
        'Cards maintain readable width'
      ]
    },
    {
      name: 'Header Section',
      element: 'header',
      checks: [
        'Title remains centered',
        'Text scales appropriately',
        'Proper margin spacing',
        'Readable on all screen sizes'
      ]
    },
    {
      name: 'Task List Component',
      element: 'TaskList',
      checks: [
        'Form fields stack properly on mobile',
        'Grid layout adapts (1 col mobile, 2 col desktop)',
        'Buttons remain accessible',
        'Text content wraps appropriately'
      ]
    },
    {
      name: 'Mood Tracker Grid',
      element: 'MoodTracker',
      checks: [
        'Mood buttons: 2 cols mobile, 3 cols tablet, 5 cols desktop',
        'Buttons maintain touch-friendly size',
        'Slider remains usable',
        'Form layout adapts'
      ]
    },
    {
      name: 'Suggestion Tabs',
      element: 'SuggestionBox',
      checks: [
        'Tab labels remain visible',
        'Tab container doesn\'t overflow',
        'Content cards maintain readability',
        'Icons and text scale properly'
      ]
    },
    {
      name: 'Analytics Charts',
      element: 'WeeklyAnalytics',
      checks: [
        'Charts maintain aspect ratio',
        'Tab navigation adapts',
        'Summary cards: 2 cols mobile, 4 cols desktop',
        'Chart legends remain readable'
      ]
    }
  ];

  const checkpoints = [
    { width: 375, name: 'iPhone SE' },
    { width: 390, name: 'iPhone 12' },
    { width: 414, name: 'iPhone 12 Pro Max' },
    { width: 768, name: 'iPad Mini' },
    { width: 1024, name: 'iPad Pro' },
    { width: 1280, name: 'Desktop' },
    { width: 1920, name: 'Large Monitor' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsTestMode(!isTestMode)}
        className="lifesync-btn lifesync-btn-primary shadow-lg"
        title="Toggle Responsive Test Suite"
      >
        📱 Responsive Test
      </button>

      {/* Test Panel */}
      {isTestMode && (
        <div className="absolute bottom-12 right-0 w-80 bg-white rounded-lg shadow-xl border p-4 max-h-96 overflow-y-auto lifesync-slide-in">
          <div className="mb-4">
            <h3 className="lifesync-heading-4 mb-2">Responsive Design Test</h3>
            
            {/* Current Status */}
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <div className="lifesync-body-sm font-medium text-blue-800">
                Current: {currentBreakpoint.name}
              </div>
              <div className="lifesync-caption text-blue-600">
                {windowSize.width}x{windowSize.height}px
              </div>
              <div className="lifesync-caption text-blue-600">
                {currentBreakpoint.description}
              </div>
            </div>

            {/* Quick Size Tests */}
            <div className="mb-3">
              <div className="lifesync-caption font-medium mb-1">Quick Tests:</div>
              <div className="flex flex-wrap gap-1">
                {checkpoints.map((checkpoint) => (
                  <button
                    key={checkpoint.width}
                    onClick={() => {
                      // Note: This would require a browser extension or dev tools
                      // to actually resize the window programmatically
                      alert(`Resize browser to ${checkpoint.width}px to test ${checkpoint.name}`);
                    }}
                    className="lifesync-btn lifesync-btn-sm lifesync-btn-secondary text-xs"
                    title={`Test at ${checkpoint.width}px width`}
                  >
                    {checkpoint.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Checklist */}
            <div>
              <div className="lifesync-caption font-medium mb-2">Component Checks:</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {testComponents.map((component, index) => (
                  <div key={index} className="border border-gray-200 rounded p-2">
                    <div className="lifesync-caption font-medium text-gray-800 mb-1">
                      {component.name}
                    </div>
                    <div className="space-y-1">
                      {component.checks.map((check, checkIndex) => (
                        <div key={checkIndex} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-3 w-3"
                            id={`check-${index}-${checkIndex}`}
                          />
                          <label
                            htmlFor={`check-${index}-${checkIndex}`}
                            className="lifesync-caption text-gray-600 leading-tight"
                          >
                            {check}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Resize Instructions */}
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="lifesync-caption text-yellow-800 font-medium">
                💡 Testing Instructions:
              </div>
              <div className="lifesync-caption text-yellow-700 mt-1">
                1. Resize browser window or use dev tools device simulation<br/>
                2. Check each component at different breakpoints<br/>
                3. Use checkboxes to track tested features<br/>
                4. Verify touch targets are ≥44px on mobile
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTestSuite; 