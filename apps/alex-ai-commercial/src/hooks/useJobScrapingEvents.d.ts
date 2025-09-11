interface ScrapingJob {
    id: string;
    source: string;
    search_term: string;
    location: string;
    status: string;
    jobs_found: number;
    jobs_stored: number;
    started_at: string;
    completed_at?: string;
    error_message?: string;
}
interface UseJobScrapingEventsReturn {
    jobs: ScrapingJob[];
    isConnected: boolean;
    error: string | null;
    reconnect: () => void;
    lastUpdate: Date | null;
}
export declare function useJobScrapingEvents(): UseJobScrapingEventsReturn;
export declare function useLatestJobStatus(): {
    latestJob: ScrapingJob | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useJobScrapingEvents.d.ts.map