# 🎨 Alex AI Artist Management Platform

A comprehensive career management and booking platform for artists across all disciplines, built with Next.js 15 and powered by Alex AI.

## 🚀 Features

### Core Functionality
- **Artist Profile Management** - Comprehensive profiles for all art forms
- **Smart Booking System** - AI-powered opportunity matching and booking automation
- **Portfolio Showcase** - Adaptive portfolios for different artistic disciplines
- **Financial Tracking** - Revenue tracking, expense management, and tax preparation
- **Analytics Dashboard** - Career insights and performance metrics
- **Communication Hub** - Integrated messaging and collaboration tools

### Artist Types Supported
- 🎵 **Musicians & Bands** - Live performance booking, setlist management, fan engagement
- 🎨 **Visual Artists** - Gallery bookings, commission management, art sales
- 📚 **Writers & Poets** - Reading bookings, publication management, literary events
- 🎧 **DJs & Electronic Artists** - Club bookings, music library management, event tracking
- 📸 **Photographers** - Shoot bookings, client management, licensing
- 🎭 **Performers** - Performance bookings, audition management, talent agencies
- ✂️ **Artisan Craftspeople** - Craft show bookings, workshop management, product sales
- 💻 **Digital Artists** - Commission management, digital portfolio, speaking engagements

### AI-Powered Features
- **Smart Recommendations** - Personalized opportunity matching
- **Automated Booking** - Streamlined booking workflow automation
- **Career Insights** - AI-driven career development recommendations
- **Content Generation** - Automated bio writing, press kit generation
- **Performance Analytics** - Data-driven insights for career growth

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Lucide React icons
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: Alex AI ecosystem (MCP, RAG, N8N workflows)
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (for authentication and database)
- Alex AI API access (for AI features)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd apps/alex-ai-artist-management
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components (header, footer)
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   └── utils.ts          # Common utility functions
└── types/                # TypeScript type definitions
```

## 🎯 Development Workflow

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests (when implemented)
- `pnpm prepare` - Copy environment example file

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Application
NEXT_PUBLIC_APP_NAME="Alex AI Artist Management"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"

# Alex AI Integration
ALEX_AI_API_URL="https://n8n.pbradygeorgen.com"
N8N_API_KEY="your_n8n_api_key_here"

# AI Services
OPENAI_API_KEY="your_openai_api_key_here"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"

# Add other services as needed...
```

## 🤖 Alex AI Integration

This application leverages the full Alex AI ecosystem:

### MCP (Model Context Protocol)
- Tool access and automation
- Cross-platform integrations
- Standardized AI agent communication

### RAG (Retrieval-Augmented Generation)
- Opportunity matching and recommendations
- Knowledge base integration
- Context-aware responses

### N8N Workflows
- Booking automation
- Email notifications
- Data synchronization
- Process orchestration

### Crew Member Specialization
- **Captain Picard** - Strategic career planning
- **Commander Riker** - Tactical implementation
- **Commander Data** - Analytics and insights
- **Geordi La Forge** - Technical integration
- **Lieutenant Worf** - Security and compliance
- **Counselor Troi** - User experience optimization
- **Lieutenant Uhura** - Communication workflows
- **Dr. Crusher** - Performance monitoring
- **Quark** - Business intelligence

## 📱 Features Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic authentication and user profiles
- ✅ Artist type selection and onboarding
- ✅ Basic dashboard and navigation
- ✅ Portfolio upload and management

### Phase 2: Core Features (Next)
- 🔄 Opportunity discovery and browsing
- 🔄 Booking request system
- 🔄 Calendar integration
- 🔄 Basic messaging system

### Phase 3: Advanced Features
- 📋 Financial tracking and reporting
- 📋 Advanced search and filtering
- 📋 Community features and networking
- 📋 Mobile responsiveness optimization

### Phase 4: AI Enhancement
- 📋 AI-powered recommendations
- 📋 Advanced analytics and insights
- 📋 Payment processing integration
- 📋 Performance optimization

## 🧪 Testing

Testing setup will be implemented using:
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright
- **Type Safety**: TypeScript strict mode

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **AWS**: Use Amplify or custom deployment
- **Docker**: Use provided Dockerfile (when added)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of the Alex AI ecosystem and follows the same licensing terms.

## 🆘 Support

- **Documentation**: [Alex AI Docs](https://docs.alex-ai.com)
- **Community**: [Discord Server](https://discord.gg/alex-ai)
- **Issues**: [GitHub Issues](https://github.com/alex-ai/artist-management/issues)
- **Email**: support@alex-ai-artist-management.com

## 🙏 Acknowledgments

Built with ❤️ by the Alex AI Crew:
- Captain Jean-Luc Picard (Strategic Leadership)
- Commander William Riker (Tactical Execution)
- Commander Data (Analytics & Logic)
- Lieutenant Commander Geordi La Forge (Technical Infrastructure)
- Lieutenant Worf (Security & Compliance)
- Counselor Deanna Troi (User Experience & Empathy)
- Lieutenant Uhura (Communications & I/O)
- Dr. Beverly Crusher (System Health & Diagnostics)
- Quark (Business Intelligence & ROI)

---

**Ready to transform your artistic career?** Start building with Alex AI Artist Management Platform today! 🚀