# Database Setup Guide

## 🎯 **Quick Setup Instructions**

### **Option 1: Manual Setup (Recommended)**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema Script**
   - Copy the entire contents of `supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see all the tables listed

### **Option 2: Using Supabase CLI (Advanced)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the schema
supabase db reset
```

## 📋 **Required Tables**

The following tables will be created:

- **`job_opportunities`** - Job postings with AI scoring
- **`contacts`** - Professional contacts and networking
- **`applications`** - Job application tracking
- **`user_analytics_events`** - User behavior tracking
- **`user_sessions`** - Session management
- **`scraping_jobs`** - Job scraping operations
- **`scheduled_scraping_configs`** - Automated scraping configuration
- **`scheduled_scraping_status`** - Scraping status tracking
- **`user_polling_preferences`** - User-specific polling settings

## 🧪 **Testing the Setup**

After creating the tables, test the API endpoints:

```bash
# Test job opportunities
curl http://localhost:3000/api/job-opportunities

# Test health check
curl http://localhost:3000/api/health

# Test database setup
curl -X POST http://localhost:3000/api/setup-database
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"relation does not exist" error**
   - Solution: Run the `supabase_schema.sql` script in Supabase Dashboard

2. **Permission denied errors**
   - Solution: Check Row Level Security (RLS) policies in Supabase

3. **Connection errors**
   - Solution: Verify your Supabase URL and API key in environment variables

### **Environment Variables Required:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 **Sample Data**

The schema includes sample data:
- 5 sample job opportunities
- 3 sample contacts
- Proper relationships between tables

## 🚀 **Next Steps After Setup**

1. **Test API Endpoints** - Verify all endpoints work
2. **Implement N8N Webhooks** - Create webhook workflows
3. **Test Full Integration** - End-to-end testing
4. **Deploy to Production** - Deploy the complete system

---

**Status**: 🚧 **READY FOR MANUAL SETUP**  
**Priority**: 🔥 **HIGH** - Required for system functionality  
**Estimated Time**: ⏱️ **5-10 minutes**
