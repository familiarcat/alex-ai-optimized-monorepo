"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJobScrapingEvents = useJobScrapingEvents;
exports.useLatestJobStatus = useLatestJobStatus;
const react_1 = require("react");
function useJobScrapingEvents() {
    const [jobs, setJobs] = (0, react_1.useState)([]);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [lastUpdate, setLastUpdate] = (0, react_1.useState)(null);
    const eventSourceRef = (0, react_1.useRef)(null);
    const reconnectTimeoutRef = (0, react_1.useRef)(null);
    const reconnectAttempts = (0, react_1.useRef)(0);
    const maxReconnectAttempts = 5;
    const connect = (0, react_1.useCallback)(() => {
        try {
            // Close existing connection
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            // Clear any existing reconnect timeout
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            console.log('🔌 Connecting to job scraping events...');
            // Create new EventSource connection
            const eventSource = new EventSource('/api/job-scraping/events');
            eventSourceRef.current = eventSource;
            eventSource.onopen = () => {
                console.log('✅ Connected to job scraping events');
                setIsConnected(true);
                setError(null);
                reconnectAttempts.current = 0;
            };
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received job scraping event:', data);
                    if (data.type === 'job_update') {
                        setJobs(prevJobs => {
                            const existingIndex = prevJobs.findIndex(job => job.id === data.job.id);
                            if (existingIndex >= 0) {
                                // Update existing job
                                const updatedJobs = [...prevJobs];
                                updatedJobs[existingIndex] = data.job;
                                return updatedJobs;
                            }
                            else {
                                // Add new job
                                return [...prevJobs, data.job];
                            }
                        });
                        setLastUpdate(new Date());
                    }
                    else if (data.type === 'jobs_list') {
                        setJobs(data.jobs || []);
                        setLastUpdate(new Date());
                    }
                }
                catch (err) {
                    console.error('❌ Error parsing job scraping event:', err);
                    setError('Failed to parse event data');
                }
            };
            eventSource.onerror = (event) => {
                console.error('❌ Job scraping events connection error:', event);
                setIsConnected(false);
                setError('Connection lost');
                // Attempt to reconnect
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff, max 30s
                    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                }
                else {
                    console.error('❌ Max reconnection attempts reached');
                    setError('Failed to reconnect after multiple attempts');
                }
            };
        }
        catch (err) {
            console.error('❌ Error creating EventSource:', err);
            setError('Failed to create connection');
            setIsConnected(false);
        }
    }, []);
    const reconnect = (0, react_1.useCallback)(() => {
        console.log('🔄 Manual reconnect requested');
        reconnectAttempts.current = 0;
        connect();
    }, [connect]);
    // Initial connection
    (0, react_1.useEffect)(() => {
        connect();
        // Cleanup on unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);
    // Fetch initial data when connected
    (0, react_1.useEffect)(() => {
        if (isConnected) {
            // Fetch current jobs to populate initial state
            fetch('/api/job-scraping')
                .then(response => response.json())
                .then(data => {
                if (Array.isArray(data)) {
                    setJobs(data);
                    setLastUpdate(new Date());
                }
            })
                .catch(err => {
                console.error('❌ Error fetching initial jobs:', err);
            });
        }
    }, [isConnected]);
    return {
        jobs,
        isConnected,
        error,
        reconnect,
        lastUpdate
    };
}
// Hook for getting the latest job status
function useLatestJobStatus() {
    const [latestJob, setLatestJob] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const fetchLatestJob = (0, react_1.useCallback)(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/job-scraping');
            const jobs = await response.json();
            if (Array.isArray(jobs) && jobs.length > 0) {
                // Get the most recent job
                const latest = jobs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0];
                setLatestJob(latest);
            }
            else {
                setLatestJob(null);
            }
        }
        catch (error) {
            console.error('❌ Error fetching latest job:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        fetchLatestJob();
    }, [fetchLatestJob]);
    return {
        latestJob,
        isLoading,
        refetch: fetchLatestJob
    };
}
//# sourceMappingURL=useJobScrapingEvents.js.map