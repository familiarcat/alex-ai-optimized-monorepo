"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
// GET - Get user-centric scheduling information
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const sessionId = searchParams.get('sessionId');
        if (action === 'analytics') {
            // Get user analytics for a specific session
            if (!sessionId) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
            }
            const analytics = await getUserAnalytics(sessionId);
            return server_1.NextResponse.json({ success: true, analytics });
        }
        if (action === 'next-refresh') {
            // Get next refresh time for a session
            if (!sessionId) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
            }
            const nextRefresh = await getNextRefreshTime(sessionId);
            return server_1.NextResponse.json({ success: true, nextRefresh });
        }
        if (action === 'should-refresh') {
            // Check if a session should refresh now
            if (!sessionId) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
            }
            const shouldRefresh = await shouldRefreshNow(sessionId);
            return server_1.NextResponse.json({ success: true, shouldRefresh });
        }
        if (action === 'user-metrics') {
            // Get aggregated user metrics
            const metrics = await getUserMetrics();
            return server_1.NextResponse.json({ success: true, metrics });
        }
        return server_1.NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
    catch (error) {
        console.error('❌ User-centric scheduling error:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// POST - Update user-centric scheduling
async function POST(request) {
    try {
        const { action, sessionId, data } = await request.json();
        if (action === 'track-interaction') {
            if (!sessionId || !data?.actionType) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID and action type required' }, { status: 400 });
            }
            await trackUserInteraction(sessionId, data.actionType, data.metadata);
            return server_1.NextResponse.json({ success: true, message: 'Interaction tracked' });
        }
        if (action === 'reset-schedule') {
            if (!sessionId) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
            }
            await resetUserSchedule(sessionId);
            return server_1.NextResponse.json({ success: true, message: 'Schedule reset' });
        }
        if (action === 'update-frequency') {
            if (!sessionId || !data?.frequency) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID and frequency required' }, { status: 400 });
            }
            await updateUserFrequency(sessionId, data.frequency);
            return server_1.NextResponse.json({ success: true, message: 'Frequency updated' });
        }
        if (action === 'login-refresh') {
            if (!sessionId) {
                return server_1.NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
            }
            await handleLoginRefresh(sessionId);
            return server_1.NextResponse.json({ success: true, message: 'Login refresh handled' });
        }
        return server_1.NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
    catch (error) {
        console.error('❌ User-centric scheduling POST error:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// Helper functions
async function getUserAnalytics(sessionId) {
    try {
        // Get session data
        const { data: session, error: sessionError } = await supabase_1.supabase
            .from('user_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single();
        if (sessionError || !session) {
            throw new Error('Session not found');
        }
        // Get recent interactions
        const { data: interactions, error: interactionsError } = await supabase_1.supabase
            .from('user_interactions')
            .select('*')
            .eq('session_id', sessionId)
            .order('timestamp', { ascending: false })
            .limit(50);
        if (interactionsError) {
            console.error('Error fetching interactions:', interactionsError);
        }
        // Calculate analytics
        const now = new Date();
        const lastActivity = new Date(session.last_activity);
        const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
        const isActiveUser = timeSinceLastActivity < 30 * 60 * 1000; // 30 minutes
        // Calculate recommended frequency using database function
        const { data: recommendedFreq, error: freqError } = await supabase_1.supabase
            .rpc('get_recommended_update_frequency', { session_id_param: sessionId });
        if (freqError) {
            console.error('Error calculating recommended frequency:', freqError);
        }
        return {
            session,
            interactions: interactions || [],
            recommendedFrequency: recommendedFreq || session.preferred_update_frequency,
            isActiveUser,
            lastSeen: session.last_activity,
            averageSessionDuration: session.average_session_duration
        };
    }
    catch (error) {
        console.error('Error getting user analytics:', error);
        throw error;
    }
}
async function getNextRefreshTime(sessionId) {
    try {
        const analytics = await getUserAnalytics(sessionId);
        const lastRefresh = new Date(analytics.session.last_automatic_refresh);
        const nextRefresh = new Date(lastRefresh.getTime() + analytics.recommendedFrequency * 60 * 1000);
        return nextRefresh;
    }
    catch (error) {
        console.error('Error getting next refresh time:', error);
        // Default to 24 hours if error
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
}
async function shouldRefreshNow(sessionId) {
    try {
        const nextRefresh = await getNextRefreshTime(sessionId);
        return new Date() >= nextRefresh;
    }
    catch (error) {
        console.error('Error checking if should refresh:', error);
        return false;
    }
}
async function trackUserInteraction(sessionId, actionType, metadata) {
    try {
        // Record interaction
        const { error: interactionError } = await supabase_1.supabase
            .from('user_interactions')
            .insert([{
                session_id: sessionId,
                action_type: actionType,
                timestamp: new Date().toISOString(),
                metadata: metadata || {}
            }]);
        if (interactionError) {
            throw interactionError;
        }
        // Update session based on interaction type
        const updateData = {
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        switch (actionType) {
            case 'login':
                updateData.last_manual_refresh = new Date().toISOString();
                updateData.total_manual_refreshes = supabase_1.supabase.raw('total_manual_refreshes + 1');
                break;
            case 'manual_refresh':
                updateData.last_manual_refresh = new Date().toISOString();
                updateData.total_manual_refreshes = supabase_1.supabase.raw('total_manual_refreshes + 1');
                break;
            case 'automatic_refresh':
                updateData.last_automatic_refresh = new Date().toISOString();
                updateData.total_automatic_refreshes = supabase_1.supabase.raw('total_automatic_refreshes + 1');
                break;
        }
        const { error: sessionError } = await supabase_1.supabase
            .from('user_sessions')
            .update(updateData)
            .eq('session_id', sessionId);
        if (sessionError) {
            throw sessionError;
        }
    }
    catch (error) {
        console.error('Error tracking user interaction:', error);
        throw error;
    }
}
async function resetUserSchedule(sessionId) {
    try {
        const { error } = await supabase_1.supabase
            .from('user_sessions')
            .update({
            last_automatic_refresh: new Date().toISOString(),
            last_manual_refresh: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('session_id', sessionId);
        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.error('Error resetting user schedule:', error);
        throw error;
    }
}
async function updateUserFrequency(sessionId, frequency) {
    try {
        const { error } = await supabase_1.supabase
            .from('user_sessions')
            .update({
            preferred_update_frequency: frequency,
            updated_at: new Date().toISOString()
        })
            .eq('session_id', sessionId);
        if (error) {
            throw error;
        }
    }
    catch (error) {
        console.error('Error updating user frequency:', error);
        throw error;
    }
}
async function handleLoginRefresh(sessionId) {
    try {
        // Always refresh data on login
        await trackUserInteraction(sessionId, 'login');
        // Reset automatic refresh cycle
        await resetUserSchedule(sessionId);
        // Adjust frequency based on user activity
        const analytics = await getUserAnalytics(sessionId);
        const newFrequency = Math.min(analytics.recommendedFrequency, 720); // Max 12 hours for active users
        await updateUserFrequency(sessionId, newFrequency);
    }
    catch (error) {
        console.error('Error handling login refresh:', error);
        throw error;
    }
}
async function getUserMetrics() {
    try {
        // Get aggregated metrics
        const { data: sessionMetrics, error: sessionError } = await supabase_1.supabase
            .from('user_sessions')
            .select('total_visits, total_manual_refreshes, total_automatic_refreshes, preferred_update_frequency');
        if (sessionError) {
            throw sessionError;
        }
        // Calculate aggregated metrics
        const totalSessions = sessionMetrics.length;
        const totalVisits = sessionMetrics.reduce((sum, s) => sum + s.total_visits, 0);
        const totalManualRefreshes = sessionMetrics.reduce((sum, s) => sum + s.total_manual_refreshes, 0);
        const totalAutomaticRefreshes = sessionMetrics.reduce((sum, s) => sum + s.total_automatic_refreshes, 0);
        const averageFrequency = sessionMetrics.reduce((sum, s) => sum + s.preferred_update_frequency, 0) / totalSessions;
        // Get recent activity (last 24 hours)
        const { data: recentInteractions, error: interactionsError } = await supabase_1.supabase
            .from('user_interactions')
            .select('action_type, timestamp')
            .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        if (interactionsError) {
            console.error('Error fetching recent interactions:', interactionsError);
        }
        const recentActivity = recentInteractions?.length || 0;
        return {
            totalSessions,
            totalVisits,
            totalManualRefreshes,
            totalAutomaticRefreshes,
            averageFrequency: Math.round(averageFrequency),
            recentActivity,
            manualRefreshRate: totalVisits > 0 ? (totalManualRefreshes / totalVisits) * 100 : 0
        };
    }
    catch (error) {
        console.error('Error getting user metrics:', error);
        throw error;
    }
}
//# sourceMappingURL=route.js.map