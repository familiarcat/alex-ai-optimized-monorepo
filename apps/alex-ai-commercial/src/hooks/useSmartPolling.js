"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSmartPolling = useSmartPolling;
exports.useExponentialBackoffPolling = useExponentialBackoffPolling;
const react_1 = require("react");
function useSmartPolling(config = {}) {
    const { baseInterval = 30000, // 30 seconds default
    activeInterval = 10000, // 10 seconds when active
    idleInterval = 60000, // 60 seconds when idle
    maxInterval = 300000, // 5 minutes max
    minInterval = 5000, // 5 seconds min
    enabled = true, onPoll } = config;
    const [state, setState] = (0, react_1.useState)({
        isActive: false,
        currentInterval: baseInterval,
        lastPoll: null,
        nextPoll: null,
        pollCount: 0,
        isPolling: false
    });
    const intervalRef = (0, react_1.useRef)(null);
    const timeoutRef = (0, react_1.useRef)(null);
    const isMountedRef = (0, react_1.useRef)(true);
    // Calculate next poll time
    const calculateNextPoll = (0, react_1.useCallback)((interval) => {
        return new Date(Date.now() + interval);
    }, []);
    // Update polling state
    const updateState = (0, react_1.useCallback)((updates) => {
        if (isMountedRef.current) {
            setState(prev => ({ ...prev, ...updates }));
        }
    }, []);
    // Determine if jobs are active based on recent activity
    const checkJobActivity = (0, react_1.useCallback)(async () => {
        try {
            const response = await fetch('/api/job-scraping');
            const jobs = await response.json();
            if (Array.isArray(jobs)) {
                const now = new Date();
                const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
                // Check if any job was active in the last 5 minutes
                const hasActiveJobs = jobs.some(job => {
                    const startedAt = new Date(job.started_at);
                    return startedAt > fiveMinutesAgo &&
                        (job.status === 'started' || job.status === 'scraping');
                });
                return hasActiveJobs;
            }
        }
        catch (error) {
            console.error('❌ Error checking job activity:', error);
        }
        return false;
    }, []);
    // Adjust polling interval based on activity
    const adjustInterval = (0, react_1.useCallback)(async () => {
        const isActive = await checkJobActivity();
        let newInterval;
        if (isActive) {
            newInterval = Math.max(minInterval, activeInterval);
        }
        else {
            newInterval = Math.min(maxInterval, idleInterval);
        }
        updateState({
            isActive,
            currentInterval: newInterval,
            nextPoll: calculateNextPoll(newInterval)
        });
        return newInterval;
    }, [activeInterval, idleInterval, maxInterval, minInterval, checkJobActivity, updateState, calculateNextPoll]);
    // Perform a poll
    const poll = (0, react_1.useCallback)(async () => {
        if (!enabled || !isMountedRef.current)
            return;
        updateState({ isPolling: true });
        try {
            // Call the onPoll callback if provided
            if (onPoll) {
                await onPoll();
            }
            updateState({
                lastPoll: new Date(),
                pollCount: state.pollCount + 1
            });
            // Adjust interval based on current activity
            await adjustInterval();
        }
        catch (error) {
            console.error('❌ Error during poll:', error);
        }
        finally {
            updateState({ isPolling: false });
        }
    }, [enabled, onPoll, state.pollCount, updateState, adjustInterval]);
    // Start polling
    const startPolling = (0, react_1.useCallback)(() => {
        if (!enabled || !isMountedRef.current)
            return;
        // Clear existing intervals
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Initial poll
        poll();
        // Set up interval for subsequent polls
        const scheduleNextPoll = () => {
            if (!enabled || !isMountedRef.current)
                return;
            timeoutRef.current = setTimeout(() => {
                poll().then(() => {
                    scheduleNextPoll();
                });
            }, state.currentInterval);
        };
        scheduleNextPoll();
    }, [enabled, poll, state.currentInterval]);
    // Stop polling
    const stopPolling = (0, react_1.useCallback)(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);
    // Force a poll
    const forcePoll = (0, react_1.useCallback)(() => {
        if (enabled && isMountedRef.current) {
            poll();
        }
    }, [enabled, poll]);
    // Reset polling
    const resetPolling = (0, react_1.useCallback)(() => {
        stopPolling();
        updateState({
            pollCount: 0,
            lastPoll: null,
            nextPoll: null,
            currentInterval: baseInterval
        });
        startPolling();
    }, [stopPolling, updateState, baseInterval, startPolling]);
    // Start/stop polling based on enabled state
    (0, react_1.useEffect)(() => {
        if (enabled) {
            startPolling();
        }
        else {
            stopPolling();
        }
        return () => {
            stopPolling();
        };
    }, [enabled, startPolling, stopPolling]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            isMountedRef.current = false;
            stopPolling();
        };
    }, [stopPolling]);
    return {
        ...state,
        startPolling,
        stopPolling,
        forcePoll,
        resetPolling,
        adjustInterval
    };
}
// Hook for polling with exponential backoff on errors
function useExponentialBackoffPolling(callback, baseInterval = 1000, maxInterval = 30000, enabled = true) {
    const [errorCount, setErrorCount] = (0, react_1.useState)(0);
    const [isPolling, setIsPolling] = (0, react_1.useState)(false);
    const timeoutRef = (0, react_1.useRef)(null);
    const calculateInterval = (0, react_1.useCallback)(() => {
        return Math.min(baseInterval * Math.pow(2, errorCount), maxInterval);
    }, [baseInterval, maxInterval, errorCount]);
    const poll = (0, react_1.useCallback)(async () => {
        if (!enabled || isPolling)
            return;
        setIsPolling(true);
        try {
            await callback();
            setErrorCount(0); // Reset error count on success
        }
        catch (error) {
            console.error('❌ Polling error:', error);
            setErrorCount(prev => prev + 1);
        }
        finally {
            setIsPolling(false);
            // Schedule next poll
            const interval = calculateInterval();
            timeoutRef.current = setTimeout(poll, interval);
        }
    }, [enabled, isPolling, callback, calculateInterval]);
    (0, react_1.useEffect)(() => {
        if (enabled) {
            poll();
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, poll]);
    return {
        errorCount,
        isPolling,
        currentInterval: calculateInterval()
    };
}
//# sourceMappingURL=useSmartPolling.js.map