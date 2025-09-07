# MCP Memory Optimization Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the MCP (Model Context Protocol) memory optimization system that intelligently manages and consolidates memories across Alex AI superagent projects using vector embeddings and similarity analysis.

## 🎯 Key Features

- **Vector-based Memory Similarity**: Uses OpenAI embeddings to find similar memories
- **Intelligent Consolidation**: Automatically consolidates redundant memories
- **Cross-project Correlation**: Identifies patterns across different projects
- **N8N Workflow Integration**: Automated memory optimization workflows
- **Supabase Vector Support**: PostgreSQL vector operations for similarity search
- **Memory Importance Scoring**: Smart retention based on access patterns and content quality
- **Real-time Optimization**: Continuous memory management without data loss

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Alex AI       │    │   MCP Memory     │    │   Supabase      │
│   Superagent    │◄──►│   Optimization   │◄──►│   Vector DB     │
│   System        │    │   System         │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   N8N Workflows │    │   OpenAI         │    │   Memory        │
│   (Automation)  │    │   Embeddings     │    │   Analytics     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### Required Services
- **Supabase**: Database with vector extension support
- **OpenAI API**: For generating embeddings
- **N8N**: For workflow automation
- **Python 3.8+**: Runtime environment

### Required Credentials
Add to your `~/.zshrc`:
```bash
# Supabase
export SUPABASE_URL="your_supabase_url"
export SUPABASE_ANON_KEY="your_supabase_anon_key"
export SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# OpenAI
export OPENAI_API_KEY="your_openai_api_key"

# N8N
export N8N_BASE_URL="http://localhost:5678"
export N8N_API_KEY="your_n8n_api_key"
```

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
# Install Python dependencies
pip install supabase openai aiohttp numpy

# Or install from requirements.txt
pip install -r requirements.txt
```

### 2. Set Up Supabase Database

```bash
# Run the memory optimization schema
psql -h your-supabase-host -U postgres -d postgres -f supabase_memory_optimization_schema.sql
```

### 3. Deploy N8N Workflow

```bash
# Import the memory consolidation workflow
curl -X POST "http://localhost:5678/api/v1/workflows" \
  -H "Content-Type: application/json" \
  -d @mcp_memory_consolidation_workflow.json
```

### 4. Configure MCP Integration

```python
# Example configuration
from mcp_integration_system import MCPIntegrationSystem
from supabase import create_client
import openai

# Initialize clients
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)

openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize MCP system
mcp_system = MCPIntegrationSystem(
    supabase_client=supabase,
    openai_client=openai,
    n8n_base_url=os.getenv('N8N_BASE_URL')
)
```

## 🔧 Configuration

### Memory Optimization Settings

```python
# Configure optimization parameters
optimizer = MCPMemoryOptimizationSystem()

# Similarity threshold for consolidation (0.0-1.0)
optimizer.similarity_threshold = 0.85

# Importance threshold for retention (0.0-1.0)
optimizer.importance_threshold = 0.3

# Maximum memories per project
optimizer.max_memories_per_project = 1000

# Consolidation frequency (days)
optimizer.consolidation_frequency_days = 7
```

### N8N Workflow Settings

```json
{
  "memory_optimization": {
    "schedule": "0 2 * * 0",  // Weekly on Sunday at 2 AM
    "similarity_threshold": 0.85,
    "max_consolidation_size": 5,
    "importance_threshold": 0.3
  }
}
```

## 📊 Usage Examples

### 1. Store a Memory

```python
# Store a new memory
response = await mcp_system.handle_mcp_request(MCPRequest(
    method="memory.store",
    params={
        "content": "Key insight: Vector embeddings improve memory search accuracy",
        "project_id": "alex-ai-optimization",
        "crew_member": "Commander Data",
        "memory_type": "insight",
        "tags": ["vector", "embeddings", "search"]
    },
    id="store_001"
))
```

### 2. Search Memories

```python
# Search for similar memories
response = await mcp_system.handle_mcp_request(MCPRequest(
    method="memory.search",
    params={
        "query": "vector embeddings",
        "similarity_threshold": 0.7,
        "limit": 10
    },
    id="search_001"
))
```

### 3. Consolidate Memories

```python
# Consolidate similar memories
response = await mcp_system.handle_mcp_request(MCPRequest(
    method="memory.consolidate",
    params={
        "project_id": "alex-ai-optimization",
        "similarity_threshold": 0.85
    },
    id="consolidate_001"
))
```

### 4. Run Full Optimization

```python
# Run complete memory optimization
response = await mcp_system.handle_mcp_request(MCPRequest(
    method="memory.optimize",
    params={},
    id="optimize_001"
))
```

## 🔄 Automated Workflows

### Weekly Memory Consolidation

The N8N workflow automatically runs every Sunday at 2 AM to:

1. **Load all memories** from Supabase
2. **Generate embeddings** for new memories
3. **Calculate similarity** between memories
4. **Identify clusters** of similar memories
5. **Consolidate memories** within clusters
6. **Update Supabase** with optimized memories
7. **Generate reports** on optimization results

### Memory Access Tracking

The system automatically tracks:
- Memory access patterns
- Importance score changes
- Consolidation history
- Cross-project correlations

## 📈 Monitoring and Analytics

### Memory Statistics

```python
# Get comprehensive memory statistics
stats = await mcp_system.get_memory_statistics({
    "project_id": "alex-ai-optimization"
})

print(f"Total memories: {stats['total_memories']}")
print(f"Average importance: {stats['avg_importance_score']:.2f}")
print(f"Consolidated memories: {stats['consolidated_memories']}")
```

### Optimization Reports

The system generates detailed reports including:
- Memory consolidation statistics
- Space saved percentages
- Project distribution analysis
- Crew member engagement metrics
- Memory type distribution
- Cluster analysis

## 🛠️ Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   ```bash
   # Check credentials
   echo $SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **OpenAI API Errors**
   ```bash
   # Verify API key
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

3. **N8N Workflow Failures**
   ```bash
   # Check N8N status
   curl http://localhost:5678/api/v1/workflows
   ```

### Debug Mode

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Run with verbose output
python mcp_memory_optimization_system.py --debug
```

## 🔒 Security Considerations

### API Key Management
- Store credentials in environment variables
- Use service role keys for Supabase operations
- Rotate API keys regularly
- Monitor API usage and costs

### Data Privacy
- Embeddings are stored in Supabase
- Memory content is encrypted in transit
- Access patterns are logged for security
- Regular backups of memory data

## 📚 API Reference

### MCP Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `memory.search` | Search memories using vector similarity | `query`, `similarity_threshold`, `limit` |
| `memory.store` | Store a new memory with embedding | `content`, `project_id`, `crew_member`, `memory_type` |
| `memory.consolidate` | Consolidate similar memories | `project_id`, `similarity_threshold` |
| `memory.optimize` | Run full memory optimization | None |
| `memory.correlate` | Find cross-project correlations | `project_ids`, `correlation_threshold` |
| `memory.stats` | Get memory statistics | `project_id` (optional) |
| `memory.export` | Export memories | `project_id`, `format`, `include_embeddings` |
| `memory.import` | Import memories | `memories`, `project_id` |

### Supabase Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `calculate_memory_importance` | Calculate importance score | `p_memory_id` |
| `find_similar_memories` | Find similar memories | `p_memory_id`, `p_similarity_threshold`, `p_limit` |
| `consolidate_memories` | Consolidate memory group | `p_memory_ids`, `p_consolidated_content`, `p_consolidated_embedding` |
| `get_memory_statistics` | Get comprehensive stats | None |

## 🚀 Production Deployment

### 1. Environment Setup

```bash
# Create production environment
python -m venv mcp_production_env
source mcp_production_env/bin/activate

# Install production dependencies
pip install -r requirements.txt
```

### 2. Database Migration

```bash
# Run production schema
psql -h production-supabase-host -U postgres -d postgres -f supabase_memory_optimization_schema.sql
```

### 3. N8N Production Setup

```bash
# Deploy production workflow
curl -X POST "https://n8n.your-domain.com/api/v1/workflows" \
  -H "Authorization: Bearer $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @mcp_memory_consolidation_workflow.json
```

### 4. Monitoring Setup

```bash
# Set up monitoring
python -c "
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mcp_optimization.log'),
        logging.StreamHandler()
    ]
)
"
```

## 📊 Performance Optimization

### Memory Usage
- Limit embeddings to 1536 dimensions
- Use batch processing for large datasets
- Implement memory caching for frequent queries
- Regular cleanup of old access logs

### Database Performance
- Create appropriate indexes for vector operations
- Use connection pooling for Supabase
- Implement query result caching
- Monitor query performance

### API Rate Limits
- Implement exponential backoff for OpenAI API
- Use batch requests when possible
- Monitor API usage and costs
- Implement request queuing for high volume

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Run memory consolidation
- **Monthly**: Review optimization reports
- **Quarterly**: Update similarity thresholds
- **Annually**: Review and update importance scoring

### Backup Strategy
- Daily backups of memory data
- Weekly exports of consolidated memories
- Monthly full system backups
- Test restore procedures quarterly

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs in `mcp_optimization.log`
3. Check Supabase query performance
4. Verify N8N workflow status
5. Contact the development team

## 🎉 Success Metrics

After deployment, you should see:
- **50-70% reduction** in memory storage
- **Improved search accuracy** with vector similarity
- **Faster memory retrieval** with optimized storage
- **Better cross-project insights** from correlations
- **Automated maintenance** with N8N workflows

The MCP memory optimization system will continuously learn and improve memory management across all Alex AI superagent projects, ensuring efficient knowledge retention while preventing exponential growth.
