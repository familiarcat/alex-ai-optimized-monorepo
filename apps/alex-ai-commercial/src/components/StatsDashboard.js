"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatsDashboard;
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
function StatsDashboard({ totalJobs, stLouisJobs, remoteJobs, highScoreJobs, applications, onExportContacts, onGenerateReport, onRefreshData }) {
    const stats = [
        {
            name: 'Total Opportunities',
            value: totalJobs,
            icon: outline_1.BriefcaseIcon,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        },
        {
            name: 'St. Louis Area',
            value: stLouisJobs,
            icon: outline_1.MapPinIcon,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            name: 'Remote Options',
            value: remoteJobs,
            icon: outline_1.GlobeAltIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            name: 'High Match Quality',
            value: highScoreJobs,
            icon: outline_1.ChartBarIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            name: 'Applications',
            value: applications,
            icon: outline_1.DocumentTextIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];
    return (<div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Dashboard Stats
      </h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (<framer_motion_1.motion.div key={stat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{stat.name}</p>
                <p className="text-xs text-gray-500">
                  {stat.name === 'Total Opportunities' && 'All job opportunities'}
                  {stat.name === 'St. Louis Area' && 'Local opportunities'}
                  {stat.name === 'Remote Options' && 'Central Time Zone'}
                  {stat.name === 'High Match Quality' && '85+ match score'}
                  {stat.name === 'Applications' && 'Submitted applications'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              {stat.name === 'Total Opportunities' && (<p className="text-xs text-gray-500">
                  {Math.round((highScoreJobs / totalJobs) * 100)}% high leverage
                </p>)}
            </div>
          </framer_motion_1.motion.div>))}
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>St. Louis Coverage</span>
            <span>{Math.round((stLouisJobs / totalJobs) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: `${(stLouisJobs / totalJobs) * 100}%` }} transition={{ delay: 0.5, duration: 1 }} className="bg-yellow-500 h-2 rounded-full"/>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Remote Options</span>
            <span>{Math.round((remoteJobs / totalJobs) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: `${(remoteJobs / totalJobs) * 100}%` }} transition={{ delay: 0.7, duration: 1 }} className="bg-blue-500 h-2 rounded-full"/>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>High Match Quality</span>
            <span>{Math.round((highScoreJobs / totalJobs) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: `${(highScoreJobs / totalJobs) * 100}%` }} transition={{ delay: 0.9, duration: 1 }} className="bg-green-500 h-2 rounded-full"/>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button onClick={onExportContacts} className="w-full text-left px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">
            📧 Export Contact List
          </button>
          <button onClick={onGenerateReport} className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
            📊 Generate Report
          </button>
          <button onClick={onRefreshData} className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=StatsDashboard.js.map