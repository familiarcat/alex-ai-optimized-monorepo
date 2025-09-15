# 🖖 Alex AI Master Dashboard

**Crew Lead**: Captain Picard  
**Crew Support**: Counselor Troi, Commander Data, Lieutenant Commander La Forge  
**Purpose**: Unified entry point and command center for all Alex AI specialized applications

## ✨ Features

### 🎯 Master Dashboard Capabilities
- **Application Launcher**: Quick access to all 9 specialized Alex AI applications
- **Real-time Status Monitoring**: Live status of all running applications
- **Cross-app Navigation**: Seamless navigation between specialized apps
- **Unified Authentication**: Single sign-on across all applications
- **Crew Memory Integration**: Access to all Supabase crew memories
- **System Health Overview**: Performance and health monitoring
- **Notification Center**: Centralized notifications from all apps
- **Crew Coordination**: Real-time crew member status and capabilities

### 🖖 Captain Picard's Leadership
- **Strategic Oversight**: High-level view of all system operations
- **Crew Coordination**: Manage and coordinate all 9 crew members
- **Decision Support**: Strategic insights and recommendations
- **Mission Planning**: Plan and execute complex operations
- **Leadership Insights**: Advanced analytics for decision making

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **State Management**: React Query, Zustand
- **Real-time**: Socket.io for live updates
- **Database**: PostgreSQL (via Supabase) with crew memories
- **Deployment**: Vercel with CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account
- All specialized apps running on ports 3001-3009

### Installation
```bash
cd apps/alex-ai-master-dashboard
pnpm install
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
NEXT_PUBLIC_SUPABASE_URL=https://rpkkkbufdwxmjaerbhbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development
```bash
# Start master dashboard
pnpm run dev

# Check status of all apps
pnpm run apps:status

# Test dashboard integration
pnpm run dashboard:test
```

## 🎯 Specialized Applications

### **Data Analytics** (Port 3001)
- **Crew Lead**: Commander Data
- **URL**: http://localhost:3001
- **Features**: Real-time analytics, ML models, predictive insights

### **Communication Hub** (Port 3002)
- **Crew Lead**: Lieutenant Uhura
- **URL**: http://localhost:3002
- **Features**: Multi-channel messaging, notifications, contact sync

### **Engineering Workshop** (Port 3003)
- **Crew Lead**: Lieutenant Commander La Forge
- **URL**: http://localhost:3003
- **Features**: Development tools, code analysis, project management

### **Business Intelligence** (Port 3004)
- **Crew Lead**: Quark
- **URL**: http://localhost:3004
- **Features**: Revenue tracking, subscription management, ROI analysis

### **User Experience** (Port 3005)
- **Crew Lead**: Counselor Troi
- **URL**: http://localhost:3005
- **Features**: UX analytics, A/B testing, accessibility compliance

### **Security Command** (Port 3006)
- **Crew Lead**: Lieutenant Worf
- **URL**: http://localhost:3006
- **Features**: Security monitoring, threat detection, compliance

### **Health Monitoring** (Port 3007)
- **Crew Lead**: Dr. Crusher
- **URL**: http://localhost:3007
- **Features**: System health, performance monitoring, wellness

### **Strategic Command** (Port 3008)
- **Crew Lead**: Captain Picard
- **URL**: http://localhost:3008
- **Features**: Strategic planning, decision support, mission coordination

### **Tactical Operations** (Port 3009)
- **Crew Lead**: Commander Riker
- **URL**: http://localhost:3009
- **Features**: Tactical execution, operation tracking, resource allocation

## 🔧 Development

### Available Scripts
```bash
pnpm run dev              # Start master dashboard
pnpm run build            # Build for production
pnpm run start            # Start production server
pnpm run lint             # Run ESLint
pnpm run type-check       # Run TypeScript checks
pnpm run apps:status      # Check status of all apps
pnpm run dashboard:test   # Test dashboard integration
```

### Project Structure
```
src/
├── app/
│   ├── api/                    # API routes
│   ├── apps/                   # App launcher pages
│   ├── status/                 # System status pages
│   ├── crew/                   # Crew member pages
│   ├── memories/               # Memory integration pages
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── apps/                   # App launcher components
│   ├── status/                 # Status monitoring components
│   ├── crew/                   # Crew member components
│   ├── navigation/             # Navigation components
│   └── shared/                 # Shared components
├── lib/
│   ├── apps/                   # App management utilities
│   ├── crew/                   # Crew coordination utilities
│   └── supabase/               # Supabase integration
└── types/
    └── supabase.ts             # Supabase type definitions
```

## 🎯 Key Features

### For System Management
- Unified access to all Alex AI applications
- Real-time monitoring and status updates
- Cross-app navigation and deep linking
- Centralized authentication and access control

### For Crew Coordination
- Live crew member status and capabilities
- Crew memory integration and sharing
- Strategic oversight and decision support
- Mission planning and execution tracking

## 🛡️ Security & Compliance

- **Unified Authentication**: Single sign-on across all apps
- **Role-based Access**: Crew-specific permissions and capabilities
- **Secure Communication**: Encrypted cross-app communication
- **Audit Logging**: Complete audit trail of all operations

## 📈 Success Metrics

- **App Availability**: 99.9% uptime for all specialized apps
- **Navigation Speed**: Sub-second navigation between apps
- **Crew Coordination**: Real-time crew status and communication
- **User Experience**: Intuitive and efficient workflow management

## 🤝 Contributing

This master dashboard follows the same ethical guidelines as the main Alex AI system. All contributions must align with Captain Picard's leadership principles and crew oversight framework.

## 📄 License

MIT License - See LICENSE file for details.

---

**Built with strategic leadership by Captain Picard and the Alex AI Crew** 🖖









