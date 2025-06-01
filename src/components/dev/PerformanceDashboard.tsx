
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Database, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { performanceMonitor } from '@/lib/performance-monitor';
import { advancedCacheManager } from '@/lib/advanced-cache-manager';
import { lighthouseOptimizer } from '@/lib/lighthouse-optimizer';

export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [cacheStats, setCacheStats] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const showDashboard = import.meta.env.DEV || localStorage.getItem('show-perf-dashboard') === 'true';
    setIsVisible(showDashboard);

    if (showDashboard) {
      const updateStats = () => {
        setMetrics(performanceMonitor.getMetrics());
        setCacheStats(advancedCacheManager.getCacheStats());
      };

      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, []);

  const generateFullReport = () => {
    const performanceReport = performanceMonitor.generateReport();
    const lighthouseReport = lighthouseOptimizer.generateOptimizationReport();
    const fullReport = performanceReport + '\n' + lighthouseReport;
    
    console.log(fullReport);
    
    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullReport);
      alert('Performance report copied to clipboard!');
    } else {
      alert('Performance report logged to console');
    }
  };

  const clearAllCaches = async () => {
    await advancedCacheManager.clearCache();
    alert('All caches cleared!');
    setCacheStats(advancedCacheManager.getCacheStats());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gray-900/95 backdrop-blur-lg border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="text-xs text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Core Web Vitals
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">FCP</div>
                <div className="text-white">
                  {metrics['first-contentful-paint']?.toFixed(0) || '-'}ms
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">LCP</div>
                <div className="text-white">
                  {metrics['largest-contentful-paint']?.toFixed(0) || '-'}ms
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">CLS</div>
                <div className="text-white">
                  {metrics['cumulative-layout-shift']?.toFixed(3) || '-'}
                </div>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <div className="text-gray-400">TTI</div>
                <div className="text-white">
                  {metrics['time-to-interactive']?.toFixed(0) || '-'}ms
                </div>
              </div>
            </div>
          </div>

          {/* Cache Stats */}
          <div className="space-y-2">
            <h4 className="text-xs text-gray-400 flex items-center gap-1">
              <Database className="w-3 h-3" />
              Cache Status
            </h4>
            <div className="space-y-1 text-xs">
              {Object.entries(cacheStats).map(([type, stats]) => (
                <div key={type} className="flex justify-between text-gray-300">
                  <span>{type}</span>
                  <span>{stats.memoryEntries} entries</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <Button
              onClick={generateFullReport}
              size="sm"
              variant="outline"
              className="w-full text-xs h-8"
            >
              <Target className="w-3 h-3 mr-1" />
              Generate Report
            </Button>
            <Button
              onClick={clearAllCaches}
              size="sm"
              variant="outline"
              className="w-full text-xs h-8"
            >
              Clear Caches
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
