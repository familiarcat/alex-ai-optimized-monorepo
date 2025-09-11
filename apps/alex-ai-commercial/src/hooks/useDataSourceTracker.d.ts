export type DataSource = 'mock' | 'database' | 'n8n' | 'scraping' | 'unknown';
interface DataSourceInfo {
    source: DataSource;
    lastUpdate: Date | null;
    recordCount: number;
    isLive: boolean;
    metadata?: Record<string, any>;
}
interface UseDataSourceTrackerReturn {
    dataSource: DataSourceInfo;
    updateDataSource: (jobs: any[]) => void;
    fetchScrapingJobs: () => Promise<any[]>;
    getDataSourceStatus: () => string;
    isDataSourceActive: (source: DataSource) => boolean;
}
export declare function useDataSourceTracker(): UseDataSourceTrackerReturn;
export declare function useDataSourceHistory(): {
    history: DataSourceInfo[];
    addToHistory: (dataSource: DataSourceInfo) => void;
    getHistory: () => DataSourceInfo[];
    clearHistory: () => void;
};
export declare function useDataSourceAnalytics(): {
    analytics: {
        totalRequests: number;
        sourceDistribution: Record<DataSource, number>;
        averageResponseTime: number;
        errorRate: number;
    };
    trackRequest: (source: DataSource, responseTime: number, success: boolean) => void;
    getAnalytics: () => {
        totalRequests: number;
        sourceDistribution: Record<DataSource, number>;
        averageResponseTime: number;
        errorRate: number;
    };
    resetAnalytics: () => void;
};
export {};
//# sourceMappingURL=useDataSourceTracker.d.ts.map