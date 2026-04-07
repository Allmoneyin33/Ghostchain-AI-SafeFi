# LiquidAgent: AI Cash Strategist
## Lablab AI Hackathon - Agent AI Cash Contest

### 1. The Problem
- Traditional financial apps are passive trackers.
- Users lack real-time strategic advice for wealth building.
- Cash flow management is often reactive, not proactive.

### 2. The Solution: LiquidAgent
- **Intelligent Financial Agent**: Analyzes cash flow patterns using Gemini 3 Flash.
- **Strategic Insights**: Provides 1-sentence "Daily Insights" for immediate action.
- **What-If Simulation**: Users can simulate transactions and see the impact on their liquidity before spending.
- **Ghostchain Security**: Implements rotating API keys, device binding, and HMAC signature verification for secure AI interactions.

### 3. Key Features
- **Real-Time Dashboard**: Visualizes income, expenses, and net flow.
- **AI Strategist Chat**: Natural language interface for financial planning.
- **Secure Profile Management**: Personalized experience based on user preferences.
- **Automated Key Rotation**: Backend security that rotates keys every hour.

### 4. Technology Stack
- **Frontend**: React 19, Tailwind CSS 4, Motion.
- **AI**: Google Gemini 3 Flash via `@google/genai`.
- **Backend**: Express.js with Ghostchain Security Middleware.
- **Database/Auth**: Firebase Firestore & Google Authentication.

### 5. Ghostchain Security Implementation
- **Key Rotation**: Keys rotate every 60 minutes to minimize leak impact.
- **Device Binding**: Limits access to 3 registered devices per key.
- **Signature Verification**: HMAC-SHA256 signatures for all private API requests.
- **Timestamp Validation**: Prevents replay attacks with 30-second request windows.

### 6. Vision
LiquidAgent aims to be the "CFO in your pocket," turning every transaction into a strategic step toward financial freedom.
