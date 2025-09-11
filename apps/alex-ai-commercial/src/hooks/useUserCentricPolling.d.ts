import { UserAnalytics } from '@/lib/user-analytics-simple';
interface UserCentricPollingConfig {
    baseInterval?: number;
    enabled?: boolean;
    maxRetries?: number;
    backoffMultiplier?: number;
}
interface UserCentricPollingState {
    isActive: boolean;
    lastUpdate: Date | null;
    nextUpdate: Date | null;
    userAnalytics: UserAnalytics | null;
    isUserActive: boolean;
    recommendedFrequency: number;
    errorCount: number;
    retryCount: number;
}
export declare function useUserCentricPolling<T>(fetchFunction: () => Promise<T>, config?: UserCentricPollingConfig): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    state: UserCentricPollingState;
    forceRefresh: () => Promise<void>;
    pausePolling: () => void;
    resumePolling: () => void;
    stopPolling: () => void;
    trackUserActivity: () => void;
};
export declare function useUserCentricJobScrapingPolling(): {
    data: any;
    loading: boolean;
    error: Error | null;
    state: UserCentricPollingState;
    forceRefresh: () => Promise<void>;
    pausePolling: () => void;
    resumePolling: () => void;
    stopPolling: () => void;
    trackUserActivity: () => void;
};
export declare function useUserCentricScheduledScrapingPolling(): {
    data: {
        configs: any;
        status: any;
    } | null;
    loading: boolean;
    error: Error | null;
    state: UserCentricPollingState;
    forceRefresh: () => Promise<void>;
    pausePolling: () => void;
    resumePolling: () => void;
    stopPolling: () => void;
    trackUserActivity: () => void;
};
export {};
//# sourceMappingURL=useUserCentricPolling.d.ts.map