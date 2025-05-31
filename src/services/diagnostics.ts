
export interface StorageReport {
  totalSize: number;
  itemCount: number;
  simulationItems: number;
  simulationSize: number;
  oldestItem: string;
  newestItem: string;
  largestItems: Array<{key: string; size: number; age: number}>;
  browserQuota?: number;
}

export const runStorageDiagnostics = (): StorageReport => {
  try {
    let totalSize = 0;
    let itemCount = 0;
    let simulationItems = 0;
    let simulationSize = 0;
    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    const items: Array<{key: string; size: number; timestamp: number}> = [];
    
    // Scan all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key) || '';
      const size = (key.length + value.length) * 2; // 2 bytes per character
      
      totalSize += size;
      itemCount++;
      
      // Parse timestamps from simulation items
      if (key.includes('_progress_') || key.includes('simulation')) {
        simulationItems++;
        simulationSize += size;
        
        try {
          const data = JSON.parse(value);
          const timestamp = new Date(
            data.lastSaved || data.timestamp || data.startTime || 0
          ).getTime();
          
          if (timestamp > 0) {
            if (timestamp < oldestTimestamp) oldestTimestamp = timestamp;
            if (timestamp > newestTimestamp) newestTimestamp = timestamp;
          }
          
          items.push({ key, size, timestamp });
        } catch (e) {
          // If we can't parse, just track the size
          items.push({ key, size, timestamp: 0 });
        }
      }
    }
    
    // Sort by size (largest first)
    items.sort((a, b) => b.size - a.size);
    
    // Get the 5 largest items with their age
    const largestItems = items.slice(0, 5).map(item => ({
      key: item.key,
      size: item.size,
      age: item.timestamp ? Math.round((Date.now() - item.timestamp) / (1000 * 60 * 60 * 24)) : -1
    }));
    
    // Estimate browser quota (usually 5MB but can vary)
    let browserQuota: number | undefined = undefined;
    try {
      // This is very approximate
      browserQuota = 5 * 1024 * 1024; // 5MB default
    } catch {
      // Ignore errors in quota estimation
    }
    
    return {
      totalSize,
      itemCount,
      simulationItems,
      simulationSize,
      oldestItem: new Date(oldestTimestamp).toISOString(),
      newestItem: new Date(newestTimestamp).toISOString(),
      largestItems,
      browserQuota
    };
  } catch (error) {
    console.error("Error running storage diagnostics:", error);
    return {
      totalSize: 0,
      itemCount: 0,
      simulationItems: 0,
      simulationSize: 0,
      oldestItem: new Date().toISOString(),
      newestItem: new Date().toISOString(),
      largestItems: []
    };
  }
};

export const getSimulationHealthStatus = (): 'good' | 'fair' | 'poor' => {
  const report = runStorageDiagnostics();
  
  if (!report.browserQuota) return 'fair';
  
  // Calculate used storage percentage
  const usedPercentage = (report.totalSize / report.browserQuota) * 100;
  
  if (usedPercentage > 80) {
    return 'poor';
  } else if (usedPercentage > 50) {
    return 'fair';
  } else {
    return 'good';
  }
};
