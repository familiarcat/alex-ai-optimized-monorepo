"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataSourceIndicatorTest;
const react_1 = __importStar(require("react"));
const DataSourceIndicator_1 = __importDefault(require("./DataSourceIndicator"));
function DataSourceIndicatorTest() {
    const [currentTest, setCurrentTest] = (0, react_1.useState)(0);
    const testCases = [
        {
            source: 'live',
            totalJobs: 25,
            liveJobs: 15,
            cachedJobs: 10,
            lastUpdated: new Date().toISOString(),
            scrapingStatus: 'active'
        },
        {
            source: 'cached',
            totalJobs: 20,
            liveJobs: 0,
            cachedJobs: 20,
            lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            scrapingStatus: 'idle',
            nextScrape: new Date(Date.now() + 13 * 60 * 1000).toISOString() // 13 minutes from now
        },
        {
            source: 'mock',
            totalJobs: 12,
            lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            scrapingStatus: 'idle'
        },
        {
            source: 'fallback',
            totalJobs: 8,
            lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            scrapingStatus: 'error'
        }
    ];
    const testNames = [
        'Live Scraping Active',
        'Cached Data (2h old)',
        'Mock Data (1d old)',
        'Fallback Data (3d old)'
    ];
    return (<div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Data Source Indicator Test</h3>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          {testNames.map((name, index) => (<button key={index} onClick={() => setCurrentTest(index)} className={`px-3 py-1 rounded text-sm ${currentTest === index
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'}`}>
              {name}
            </button>))}
        </div>
        
        <div className="bg-white p-4 rounded border">
          <DataSourceIndicator_1.default dataSource={testCases[currentTest]} onRefresh={() => console.log('Refresh clicked')}/>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Current Test:</strong> {testNames[currentTest]}</p>
        <p><strong>Source:</strong> {testCases[currentTest].source}</p>
        <p><strong>Total Jobs:</strong> {testCases[currentTest].totalJobs}</p>
        {testCases[currentTest].liveJobs !== undefined && (<p><strong>Live Jobs:</strong> {testCases[currentTest].liveJobs}</p>)}
        {testCases[currentTest].cachedJobs !== undefined && (<p><strong>Cached Jobs:</strong> {testCases[currentTest].cachedJobs}</p>)}
        <p><strong>Status:</strong> {testCases[currentTest].scrapingStatus}</p>
      </div>
    </div>);
}
//# sourceMappingURL=DataSourceIndicatorTest.js.map