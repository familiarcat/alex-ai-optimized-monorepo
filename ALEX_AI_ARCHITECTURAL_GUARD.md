# ALEX AI ARCHITECTURAL GUARD
## N8N GATEKEEPER ENFORCEMENT

**CRITICAL: This document must be referenced before ANY data architecture decisions**

### THE RULE
**SUPABASE IS BEHIND N8N - NEVER IN NEXT.JS FRONTEND**

### ARCHITECTURE FLOW
```
✅ CORRECT: Client → N8N → Supabase → N8N → Client
❌ WRONG: Client → Supabase (bypassing N8N)
```

### WHAT THIS MEANS
- **NEVER** import `@supabase/supabase-js` in Next.js components
- **NEVER** create Supabase clients in API routes
- **NEVER** make direct database calls from frontend
- **ALWAYS** route ALL data through N8N webhooks
- **ALWAYS** use N8N as the single source of truth

### VIOLATION PREVENTION
Before writing ANY code that touches data:
1. Ask: "Does this bypass N8N?"
2. If YES: STOP - Use N8N webhook instead
3. If NO: Proceed with N8N data service

### EVIDENCE OF VIOLATIONS
- Importing `createClient` from `@supabase/supabase-js`
- Direct Supabase calls in API routes
- Mock data fallbacks instead of N8N errors
- Any `supabase.from()` calls in frontend code

### ENFORCEMENT
This rule has been added to Alex AI's permanent memory system.
Any violation of this rule is a critical architectural error that must be fixed immediately.

**Last Updated**: 2025-09-08T21:00:02
**Status**: ACTIVE - ENFORCED
