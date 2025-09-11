"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserCentricPolling = useUserCentricPolling;
exports.useUserCentricJobScrapingPolling = useUserCentricJobScrapingPolling;
exports.useUserCentricScheduledScrapingPolling = useUserCentricScheduledScrapingPolling;
const react_1 = require("react");
const user_analytics_simple_1 = require("@/lib/user-analytics-simple");
function useUserCentricPolling(fetchFunction, config = {}) {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [state, setState] = (0, react_1.useState)({
        isActive: false,
        lastUpdate: null,
        nextUpdate: null,
        userAnalytics: null,
        isUserActive: false,
        recommendedFrequency: 1440, // 24 hours default
        errorCount: 0,
        retryCount: 0
    });
    const intervalRef = (0, react_1.useRef)(null);
    const timeoutRef = (0, react_1.useRef)(null);
    const isMountedRef = (0, react_1.useRef)(true);
    const lastUserActivityRef = (0, react_1.useRef)(new Date());
    const { baseInterval = 1440, // 24 hours default
    enabled = true, maxRetries = 3, backoffMultiplier = 2 } = config;
    // Load user analytics and determine polling frequency
    const loadUserAnalytics = (0, react_1.useCallback)(async () => {
        try {
            const analytics = await user_analytics_simple_1.userAnalytics.getUserAnalytics();
            if (analytics) {
                setState(prev => ({
                    ...prev,
                    userAnalytics: analytics,
                    isUserActive: analytics.isActiveUser,
                    recommendedFrequency: analytics.recommendedFrequency
                }));
                // Track page view
                await user_analytics_simple_1.userAnalytics.trackPageView('polling_dashboard');
                return analytics;
            }
        }
        catch (error) {
            console.error('Error loading user analytics:', error);
        }
        return null;
    }, []);
    // Calculate next update time based on user behavior
    const calculateNextUpdate = (0, react_1.useCallback)((analytics) => {
        if (!analytics) {
            // Default to 24 hours if no analytics
            return new Date(Date.now() + baseInterval * 60 * 1000);
        }
        const now = new Date();
        const lastRefresh = new Date(analytics.session.last_automatic_refresh);
        const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime();
        const recommendedInterval = analytics.recommendedFrequency * 60 * 1000;
        // If user is active and hasn't refreshed recently, refresh sooner
        if (analytics.isActiveUser && timeSinceLastRefresh > recommendedInterval * 0.5) {
            return new Date(now.getTime() + recommendedInterval * 0.3); // 30% of recommended interval
        }
        // If user manually refreshed recently, respect their preference
        const lastManualRefresh = new Date(analytics.session.last_manual_refresh);
        const timeSinceManualRefresh = now.getTime() - lastManualRefresh.getTime();
        if (timeSinceManualRefresh < 60 * 60 * 1000) { // Within 1 hour
            return new Date(now.getTime() + recommendedInterval * 0.5); // 50% of recommended interval
        }
        // Default to recommended frequency
        return new Date(now.getTime() + recommendedInterval);
    }, [baseInterval]);
    const fetchData = (0, react_1.useCallback)(async (isRetry = false, isManual = false) => {
        if (!isMountedRef.current)
            return;
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            if (isMountedRef.current) {
                setData(result);
                setState(prev => ({
                    ...prev,
                    isActive: true,
                    lastUpdate: new Date(),
                    errorCount: 0,
                    retryCount: 0
                }));
                // Track the refresh
                if (isManual) {
                    await user_analytics_simple_1.userAnalytics.trackManualRefresh();
                }
                else {
                    await user_analytics_simple_1.userAnalytics.trackInteraction('automatic_refresh');
                }
                // Update next update time
                const analytics = await loadUserAnalytics();
                const nextUpdate = calculateNextUpdate(analytics);
                setState(prev => ({ ...prev, nextUpdate }));
            }
        }
        catch (err) {
            if (isMountedRef.current) {
                const error = err instanceof Error ? err : new Error('Unknown error');
                setError(error);
                setState(prev => {
                    const newErrorCount = prev.errorCount + 1;
                    const newRetryCount = prev.retryCount + 1;
                    // If we've exceeded max retries, stop polling
                    if (newRetryCount >= maxRetries) {
                        return {
                            ...prev,
                            isActive: false,
                            errorCount: newErrorCount,
                            retryCount: newRetryCount
                        };
                    }
                    return {
                        ...prev,
                        errorCount: newErrorCount,
                        retryCount: newRetryCount
                    };
                });
                // Schedule retry with exponential backoff
                if (state.retryCount < maxRetries) {
                    const retryDelay = 60000 * Math.pow(backoffMultiplier, state.retryCount); // Start with 1 minute
                    timeoutRef.current = setTimeout(() => {
                        if (isMountedRef.current) {
                            fetchData(true);
                        }
                    }, retryDelay);
                }
            }
        }
        finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [fetchFunction, maxRetries, backoffMultiplier, state.retryCount, loadUserAnalytics, calculateNextUpdate]);
    const startPolling = (0, react_1.useCallback)(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (enabled && state.isActive) {
            // Use a shorter interval for checking (every minute)
            // but only actually fetch when it's time based on user analytics
            intervalRef.current = setInterval(async () => {
                if (isMountedRef.current) {
                    const shouldRefresh = await user_analytics_simple_1.userAnalytics.shouldRefresh();
                    if (shouldRefresh) {
                        fetchData();
                    }
                }
            }, 60000); // Check every minute
        }
    }, [enabled, state.isActive, fetchData]);
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
    const pausePolling = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, isActive: false }));
        stopPolling();
    }, [stopPolling]);
    const resumePolling = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, isActive: true }));
    }, []);
    const forceRefresh = (0, react_1.useCallback)(async () => {
        stopPolling();
        await fetchData(false, true); // Mark as manual refresh
    }, [fetchData, stopPolling]);
    // Check for user activity and adjust polling accordingly
    const checkUserActivity = (0, react_1.useCallback)(async () => {
        const now = new Date();
        const timeSinceLastActivity = now.getTime() - lastUserActivityRef.current.getTime();
        // If user has been inactive for more than 30 minutes, reduce polling frequency
        if (timeSinceLastActivity > 30 * 60 * 1000) {
            setState(prev => ({ ...prev, isUserActive: false }));
        }
        else {
            setState(prev => ({ ...prev, isUserActive: true }));
        }
    }, []);
    // Track user activity
    const trackUserActivity = (0, react_1.useCallback)(() => {
        lastUserActivityRef.current = new Date();
        setState(prev => ({ ...prev, isUserActive: true }));
    }, []);
    // Initial setup
    (0, react_1.useEffect)(() => {
        const initialize = async () => {
            if (enabled) {
                // Load user analytics
                const analytics = await loadUserAnalytics();
                // Calculate next update time
                const nextUpdate = calculateNextUpdate(analytics);
                setState(prev => ({ ...prev, nextUpdate }));
                // Initial fetch
                await fetchData();
            }
        };
        initialize();
    }, [enabled, loadUserAnalytics, calculateNextUpdate, fetchData]);
    // Start/stop polling based on state
    (0, react_1.useEffect)(() => {
        if (enabled && state.isActive && state.retryCount < maxRetries) {
            startPolling();
        }
        else {
            stopPolling();
        }
        return () => stopPolling();
    }, [enabled, state.isActive, state.retryCount, startPolling, stopPolling]);
    // Check user activity periodically
    (0, react_1.useEffect)(() => {
        const activityInterval = setInterval(checkUserActivity, 60000); // Check every minute
        return () => clearInterval(activityInterval);
    }, [checkUserActivity]);
    // Track user activity on various events
    (0, react_1.useEffect)(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        const handleUserActivity = () => {
            trackUserActivity();
        };
        events.forEach(event => {
            document.addEventListener(event, handleUserActivity, true);
        });
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserActivity, true);
            });
        };
    }, [trackUserActivity]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            isMountedRef.current = false;
            stopPolling();
        };
    }, [stopPolling]);
    return {
        data,
        loading,
        error,
        state,
        forceRefresh,
        pausePolling,
        resumePolling,
        stopPolling,
        trackUserActivity
    };
}
// Specialized hook for job scraping with user-centric polling
function useUserCentricJobScrapingPolling() {
    const fetchScrapingJobs = (0, react_1.useCallback)(async () => {
        const response = await fetch('/api/job-scraping');
        if (!response.ok)
            throw new Error('Failed to fetch scraping jobs');
        return response.json();
    }, []);
    return useUserCentricPolling(fetchScrapingJobs, {
        baseInterval: 1440, // 24 hours default
        enabled: true,
        maxRetries: 3,
        backoffMultiplier: 2
    });
}
// Specialized hook for scheduled scraping with user-centric polling
function useUserCentricScheduledScrapingPolling() {
    const fetchScheduledData = (0, react_1.useCallback)(async () => {
        const [configsResponse, statusResponse] = await Promise.all([
            fetch('/api/scheduled-scraping?action=configs'),
            fetch('/api/scheduled-scraping?action=status')
        ]);
        if (!configsResponse.ok || !statusResponse.ok) {
            throw new Error('Failed to fetch scheduled scraping data');
        }
        const [configs, status] = await Promise.all([
            configsResponse.json(),
            statusResponse.json()
        ]);
        return { configs: configs.configs, status: status.status };
    }, []);
    return useUserCentricPolling(fetchScheduledData, {
        baseInterval: 1440, // 24 hours default
        enabled: true,
        maxRetries: 2,
        backoffMultiplier: 1.5
    });
}
//# sourceMappingURL=useUserCentricPolling.js.map