# NBA CallCheck Chrome Extension v0.3.0

A comprehensive transparency tool for NBA referee calls that helps fans analyze, vote on, and understand game decisions with advanced AI-powered insights and real-time community engagement.

## 🚀 New Features in v0.3.0

### Supabase Integration
- **Real-time Database**: Full Supabase integration with PostgreSQL backend
- **Live Voting**: Real-time community voting with instant updates
- **Data Synchronization**: Seamless switching between live and demo modes
- **Vote Aggregation**: Automatic vote counting with database triggers
- **IP-based Voting**: Anonymous voting system with duplicate prevention

### Enhanced Database Schema
- **Comprehensive Tables**: Games, referees, players, calls, votes, and aggregates
- **Referential Integrity**: Proper foreign key relationships
- **Row Level Security**: Secure public read access with controlled write permissions
- **Real-time Subscriptions**: Live updates using Supabase's real-time features
- **Sample Data**: Pre-populated with realistic NBA data for testing

### Advanced Features
- **Connection Status**: Live indicator showing database connectivity
- **Error Handling**: Graceful fallback to demo mode on connection issues
- **Loading States**: Professional loading indicators during data fetching
- **Vote Validation**: Prevents duplicate voting with clear error messages
- **Performance Optimization**: Efficient database queries with proper indexing

## Features

### 🎯 Core Functionality
- **AI-Powered Analysis**: Confidence scoring for referee decisions with detailed explanations
- **Real-time Voting**: Live community voting with instant result updates
- **Statistical Context**: Comprehensive referee and player historical data
- **Call Navigation**: Browse through multiple calls from recent games
- **Extension Interface**: Clean, professional popup optimized for Chrome/Firefox

### 📊 Database Features
- **Live Data**: Real-time synchronization with Supabase backend
- **Vote Aggregation**: Automatic calculation of voting percentages
- **Historical Data**: Comprehensive referee and player statistics
- **Game Context**: Full game information with team and date details
- **Scalable Architecture**: Designed to handle thousands of concurrent users

### 🔄 Real-time Features
- **Live Voting**: Community votes update in real-time across all users
- **Connection Monitoring**: Automatic detection of database connectivity
- **Seamless Fallback**: Graceful degradation to demo mode when offline
- **Vote Feedback**: Immediate confirmation of user participation
- **Dynamic Updates**: Statistics and percentages update automatically

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Chrome or Firefox browser
- Supabase account (for live data)

### Build & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup** (required for live data):
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

3. **Supabase Setup**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to `.env`
   - Run the migration files in your Supabase SQL editor:
     - `supabase/migrations/create_initial_schema.sql`
     - `supabase/migrations/seed_sample_data.sql`

4. **Development mode** (for testing components):
   ```bash
   npm run dev
   ```

5. **Build extension**:
   ```bash
   npm run build
   ```

### Loading as Chrome Extension

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)

3. **Load extension**:
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - The NBA CallCheck extension should appear in your extensions list

4. **Test the extension**:
   - Pin the extension to your toolbar
   - Click the NBA CallCheck icon to open the popup
   - Toggle between live and demo modes
   - Test voting functionality and real-time updates

## Database Schema

### Tables Structure

```sql
-- Core tables
games (id, home_team, away_team, game_date, season, status)
referees (id, name, accuracy_rating, total_calls, years_experience)
players (id, name, team, position, fouls_per_game, fouls_drawn_per_game)
calls (id, game_id, referee_id, call_type, description, confidence_score)
votes (id, call_id, user_id, vote_type, ip_address)
vote_aggregates (call_id, correct_votes, incorrect_votes, unclear_votes)
```

### Key Features
- **Row Level Security**: All tables protected with appropriate policies
- **Real-time Updates**: Automatic vote aggregation with database triggers
- **Duplicate Prevention**: Unique constraints on user/IP voting
- **Performance Indexes**: Optimized queries for fast data retrieval
- **Sample Data**: Pre-populated with realistic NBA scenarios

## Supabase Configuration

### Required Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Policies
- **Public Read**: All users can read games, calls, referees, and players
- **Anonymous Voting**: Anyone can submit votes (with duplicate prevention)
- **Real-time Subscriptions**: Live updates for vote aggregates

### Migration Files
1. **create_initial_schema.sql**: Creates all tables, policies, and functions
2. **seed_sample_data.sql**: Populates database with realistic test data

## Project Structure

```
src/
├── components/
│   ├── CallSelector.tsx           # Call navigation component
│   ├── EnhancedReplayCard.tsx     # Advanced replay with AI analysis
│   ├── LiveVotePanel.tsx          # Real-time community voting
│   ├── EnhancedStatsPanel.tsx     # Comprehensive statistics
│   ├── LiveCallsLoader.tsx        # Database connection handler
├── data/
│   ├── callTypes.ts               # Call type definitions and utilities
│   ├── enhancedMockData.ts        # Enhanced mock NBA data
├── lib/
│   ├── supabase.ts                # Legacy Supabase client
│   └── supabaseClient.ts          # Enhanced Supabase client with services
└── App.tsx                        # Main application with live data integration

supabase/
├── migrations/
│   ├── create_initial_schema.sql  # Database schema creation
│   └── seed_sample_data.sql       # Sample data population
```

## Usage Modes

### Demo Mode (Default)
- Uses local mock data
- Simulated voting with local state
- No database connection required
- Perfect for development and testing

### Live Mode (Supabase Connected)
- Real-time database connectivity
- Live community voting
- Automatic vote aggregation
- Real-time updates across all users

## Current Status

**Version**: 0.3.0 Production-Ready with Live Database  
**Status**: Full Supabase integration with real-time features  
**Next Steps**: Browser extension store submission, advanced analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom NBA-inspired theme
- **Icons**: Lucide React
- **Build**: Vite with extension optimization
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Target**: Chrome Extension Manifest V3

## Contributing

This is an open-source project built by NBA fans for NBA fans. Contributions welcome!

### Development Guidelines
- Follow the existing code structure and naming conventions
- Add comprehensive TypeScript types for new features
- Test both live and demo modes for new functionality
- Maintain the 400x600px popup constraint
- Test in both Chrome and Firefox

### Database Guidelines
- Always use proper RLS policies for new tables
- Include migration files for schema changes
- Test real-time subscriptions thoroughly
- Maintain data integrity with proper constraints

### Roadmap
- [x] Supabase integration with real-time voting
- [x] Comprehensive database schema
- [x] Live data synchronization
- [ ] Browser extension store submission
- [ ] Advanced analytics dashboard
- [ ] User authentication and profiles
- [ ] Historical call database expansion
- [ ] Mobile companion app

---

*NBA CallCheck is not affiliated with the NBA. Built with ❤️ by the basketball community.*