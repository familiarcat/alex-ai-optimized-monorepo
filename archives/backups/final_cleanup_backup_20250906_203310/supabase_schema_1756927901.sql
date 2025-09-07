
CREATE TABLE IF NOT EXISTS market_research (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    market text NOT NULL,\n    research_type text NOT NULL,\n    title text NOT NULL,\n    content text,\n    insights jsonb,\n    keywords jsonb,\n    business_opportunities jsonb,\n    pain_points jsonb,\n    market_size text,\n    growth_rate text,\n    competitive_landscape jsonb,\n    revenue_models jsonb,\n    source text,\n    relevance_score float,\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_market_research_market ON market_research(market)\n\nCREATE INDEX idx_market_research_type ON market_research(research_type)\n\nCREATE INDEX idx_market_research_keywords ON market_research USING GIN(keywords)\n\nCREATE INDEX idx_market_research_insights ON market_research USING GIN(insights)\n\n
CREATE TABLE IF NOT EXISTS business_models (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    model_name text NOT NULL,\n    target_market text NOT NULL,\n    description text,\n    revenue_streams jsonb,\n    pricing_strategy jsonb,\n    value_proposition text,\n    customer_segments jsonb,\n    key_partners jsonb,\n    key_activities jsonb,\n    key_resources jsonb,\n    cost_structure jsonb,\n    revenue_projections jsonb,\n    success_metrics jsonb,\n    implementation_plan jsonb,\n    risk_factors jsonb,\n    competitive_advantages jsonb,\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_business_models_market ON business_models(target_market)\n\nCREATE INDEX idx_business_models_name ON business_models(model_name)\n\nCREATE INDEX idx_business_models_revenue ON business_models USING GIN(revenue_streams)\n\n
CREATE TABLE IF NOT EXISTS execution_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    plan_name text NOT NULL,\n    plan_type text NOT NULL,\n    target_markets jsonb,\n    phases jsonb,\n    crew_assignments jsonb,\n    deliverables jsonb,\n    success_metrics jsonb,\n    risk_mitigation jsonb,\n    timeline jsonb,\n    budget jsonb,\n    dependencies jsonb,\n    status text DEFAULT 'draft',\n    progress float DEFAULT 0.0,\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_execution_plans_type ON execution_plans(plan_type)\n\nCREATE INDEX idx_execution_plans_status ON execution_plans(status)\n\nCREATE INDEX idx_execution_plans_markets ON execution_plans USING GIN(target_markets)\n\n
CREATE TABLE IF NOT EXISTS web_crawl_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    source text NOT NULL,\n    market text NOT NULL,\n    url text,\n    title text,\n    content text,\n    extracted_keywords jsonb,\n    market_data jsonb,\n    funding_info jsonb,\n    startup_profiles jsonb,\n    trends jsonb,\n    insights jsonb,\n    relevance_score float,\n    crawl_date timestamp,\n    created_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_web_crawl_source ON web_crawl_data(source)\n\nCREATE INDEX idx_web_crawl_market ON web_crawl_data(market)\n\nCREATE INDEX idx_web_crawl_keywords ON web_crawl_data USING GIN(extracted_keywords)\n\nCREATE INDEX idx_web_crawl_date ON web_crawl_data(crawl_date)\n\n
CREATE TABLE IF NOT EXISTS agile_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    project_name text NOT NULL,\n    target_market text NOT NULL,\n    description text,\n    estimated_duration text,\n    crew_assignments jsonb,\n    sprints jsonb,\n    current_sprint integer DEFAULT 1,\n    total_sprints integer,\n    status text DEFAULT 'planning',\n    progress float DEFAULT 0.0,\n    quality_score float,\n    customer_satisfaction float,\n    alex_ai_utilization float,\n    metrics jsonb,\n    alex_ai_integration jsonb,\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_agile_projects_market ON agile_projects(target_market)\n\nCREATE INDEX idx_agile_projects_status ON agile_projects(status)\n\nCREATE INDEX idx_agile_projects_crew ON agile_projects USING GIN(crew_assignments)\n\n
CREATE TABLE IF NOT EXISTS business_operations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    operation_type text NOT NULL,\n    business_name text,\n    legal_structure text,\n    target_markets jsonb,\n    llc_setup jsonb,\n    payment_integration jsonb,\n    compliance_requirements jsonb,\n    financial_projections jsonb,\n    implementation_timeline jsonb,\n    risk_assessment jsonb,\n    success_metrics jsonb,\n    status text DEFAULT 'planning',\n    progress float DEFAULT 0.0,\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_business_ops_type ON business_operations(operation_type)\n\nCREATE INDEX idx_business_ops_status ON business_operations(status)\n\nCREATE INDEX idx_business_ops_markets ON business_operations USING GIN(target_markets)\n\n
CREATE TABLE IF NOT EXISTS knowledge_base (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n    knowledge_type text NOT NULL,\n    title text NOT NULL,\n    content text,\n    source text,\n    tags jsonb,\n    insights jsonb,\n    applications jsonb,\n    related_concepts jsonb,\n    confidence_score float,\n    validation_status text DEFAULT 'pending',\n    created_at timestamp DEFAULT now(),\n    updated_at timestamp DEFAULT now()
);\n\nCREATE INDEX idx_knowledge_type ON knowledge_base(knowledge_type)\n\nCREATE INDEX idx_knowledge_tags ON knowledge_base USING GIN(tags)\n\nCREATE INDEX idx_knowledge_insights ON knowledge_base USING GIN(insights)\n\n
-- Market Research Summary View
CREATE OR REPLACE VIEW market_research_summary AS
SELECT 
    market,
    COUNT(*) as total_research,
    AVG(relevance_score) as avg_relevance,
    jsonb_agg(DISTINCT insights) as all_insights,
    jsonb_agg(DISTINCT keywords) as all_keywords
FROM market_research
GROUP BY market;

-- Business Model Summary View
CREATE OR REPLACE VIEW business_model_summary AS
SELECT 
    target_market,
    COUNT(*) as total_models,
    jsonb_agg(DISTINCT revenue_streams) as all_revenue_streams,
    jsonb_agg(DISTINCT pricing_strategy) as all_pricing_strategies
FROM business_models
GROUP BY target_market;

-- Execution Plan Summary View
CREATE OR REPLACE VIEW execution_plan_summary AS
SELECT 
    plan_type,
    COUNT(*) as total_plans,
    AVG(progress) as avg_progress,
    jsonb_agg(DISTINCT target_markets) as all_target_markets
FROM execution_plans
GROUP BY plan_type;

-- Agile Project Summary View
CREATE OR REPLACE VIEW agile_project_summary AS
SELECT 
    target_market,
    COUNT(*) as total_projects,
    AVG(progress) as avg_progress,
    AVG(quality_score) as avg_quality,
    AVG(customer_satisfaction) as avg_satisfaction
FROM agile_projects
GROUP BY target_market;

-- Knowledge Base Summary View
CREATE OR REPLACE VIEW knowledge_base_summary AS
SELECT 
    knowledge_type,
    COUNT(*) as total_knowledge,
    AVG(confidence_score) as avg_confidence,
    jsonb_agg(DISTINCT tags) as all_tags
FROM knowledge_base
GROUP BY knowledge_type;
