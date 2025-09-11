import React from 'react';
export interface DataSourceInfo {
    source: 'live' | 'cached' | 'mock' | 'fallback';
    lastUpdated?: string;
    totalJobs: number;
    liveJobs?: number;
    cachedJobs?: number;
    scrapingStatus?: 'active' | 'idle' | 'error';
    nextScrape?: string;
}
interface DataSourceIndicatorProps {
    dataSource: DataSourceInfo;
    className?: string;
    onRefresh?: () => void;
}
export default function DataSourceIndicator({ dataSource, className, onRefresh }: DataSourceIndicatorProps): React.JSX.Element;
export declare function DataSourceDetails({ dataSource }: {
    dataSource: DataSourceInfo;
}): React.JSX.Element;
export {};
//# sourceMappingURL=DataSourceIndicator.d.ts.map