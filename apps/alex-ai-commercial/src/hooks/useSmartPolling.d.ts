interface SmartPollingConfig {
    baseInterval?: number;
    activeInterval?: number;
    idleInterval?: number;
    maxInterval?: number;
    minInterval?: number;
    enabled?: boolean;
    onPoll?: () => void;
}
export declare function useSmartPolling(config?: SmartPollingConfig): {
    startPolling: () => void;
    stopPolling: () => void;
    forcePoll: () => void;
    resetPolling: () => void;
    adjustInterval: () => Promise<number>;
    isActive: boolean;
    currentInterval: number;
    lastPoll: Date | null;
    nextPoll: Date | null;
    pollCount: number;
    isPolling: boolean;
};
export declare function useExponentialBackoffPolling(callback: () => Promise<void>, baseInterval?: number, maxInterval?: number, enabled?: boolean): {
    errorCount: number;
    isPolling: boolean;
    currentInterval: number;
};
export {};
//# sourceMappingURL=useSmartPolling.d.ts.map