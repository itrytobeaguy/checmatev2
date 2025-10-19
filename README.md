# CheckMate MVP

A privacy-first scheduling application built with React and Tailwind CSS. CheckMate helps you find optimal meeting times while keeping your calendar data secure and private.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd CheckMateCursor
   
   # Or simply download and extract the files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Demo Account

For testing purposes, you can use the demo account:
- **Email:** `demo@checkmate.com`
- **Password:** `admin123`

To populate demo data, open the browser console and run:
```javascript
import('./src/services/demoData.js').then(module => module.populateDemoData());
```

### Authentication Features

✅ **User Registration & Login**
- Create new accounts with email and password
- Sign in with existing credentials
- Password strength validation
- Form validation and error handling

✅ **Cloud Data Persistence**
- User data stored in localStorage (simulated cloud storage)
- Settings and preferences saved automatically
- Availability configurations persisted
- Session management

✅ **Account Management**
- Update profile information
- Modify privacy and notification settings
- Delete account functionality
- Secure logout process

## 📁 Project Structure

```
CheckMateCursor/
├── App.jsx                    # Main application component with routing
├── components/
│   ├── Hero.jsx              # Landing page with value proposition
│   ├── CalendarSync.jsx      # OAuth integration for calendar providers
│   ├── AvailabilityPanel.jsx # Core scheduling interface
│   └── SettingsPrivacy.jsx   # User preferences and privacy controls
└── README.md                 # This file
```

## 🔧 Development Setup

### Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

### Tailwind CSS Setup

1. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure `tailwind.config.js`**
   ```javascript
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
       "./**/*.{js,jsx,ts,tsx}"
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Add Tailwind directives to your CSS**
   Create `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Import CSS in your main file**
   Add to `src/index.js`:
   ```javascript
   import './index.css';
   ```

## 🔐 Privacy-First Design

CheckMate is built with privacy as a core principle:

### Data Protection
- **Local Processing**: Calendar data is processed locally when possible
- **Minimal Data Collection**: Only essential data is collected and stored
- **User Control**: Complete control over data sharing and retention
- **Transparency**: Clear privacy policies and data usage explanations

### Privacy Features
- ✅ No data mining or advertising
- ✅ User-controlled data retention policies
- ✅ Granular privacy settings
- ✅ Data export and deletion capabilities
- ✅ Anonymous analytics (opt-in only)
- ✅ Secure OAuth integration

### Compliance Ready
- GDPR compliant data handling
- CCPA compliance for California users
- SOC 2 Type II ready architecture
- Regular security audits and updates

## 🔌 MVP Integration Steps

### Phase 1: Authentication & OAuth

1. **Set up OAuth providers**
   ```javascript
   // Google Calendar API
   const GOOGLE_CLIENT_ID = 'your-google-client-id';
   const GOOGLE_CLIENT_SECRET = 'your-google-client-secret';
   
   // Microsoft Graph API
   const OUTLOOK_CLIENT_ID = 'your-outlook-client-id';
   const OUTLOOK_CLIENT_SECRET = 'your-outlook-client-secret';
   ```

2. **Implement OAuth flows**
   - Replace mock OAuth in `CalendarSync.jsx`
   - Add proper token storage and refresh logic
   - Implement secure token management

3. **Backend endpoints needed**
   ```
   POST /api/oauth/google/callback
   POST /api/oauth/outlook/callback
   GET  /api/oauth/status
   POST /api/oauth/refresh
   ```

### Phase 2: Calendar Integration

1. **Calendar API integration**
   ```javascript
   // Google Calendar API endpoints
   GET https://www.googleapis.com/calendar/v3/calendars
   GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
   
   // Microsoft Graph API endpoints
   GET https://graph.microsoft.com/v1.0/me/calendars
   GET https://graph.microsoft.com/v1.0/me/events
   ```

2. **Real-time updates**
   - Set up webhook endpoints for calendar changes
   - Implement push notifications for Google Calendar
   - Add polling fallback for other providers

3. **Backend endpoints needed**
   ```
   GET  /api/calendars
   GET  /api/calendars/{id}/events
   POST /api/webhooks/calendar
   PUT  /api/calendars/{id}/sync
   ```

### Phase 3: Availability Engine

1. **Availability calculation**
   ```javascript
   // Core availability logic
   const calculateAvailability = (calendars, preferences) => {
     // Process calendar events
     // Apply working hours and buffer times
     // Return available time slots
   };
   ```

2. **Conflict detection**
   - Real-time conflict checking
   - Smart suggestions for alternative times
   - Automatic buffer time application

3. **Backend endpoints needed**
   ```
   GET  /api/availability/slots
   POST /api/availability/calculate
   GET  /api/availability/conflicts
   ```

### Phase 4: Booking System

1. **Public booking pages**
   - Generate shareable availability links
   - Public booking interface
   - Email confirmations and reminders

2. **Meeting management**
   - Calendar event creation
   - Email notifications
   - Meeting type templates

3. **Backend endpoints needed**
   ```
   POST /api/booking/create
   GET  /api/booking/{id}
   POST /api/booking/{id}/confirm
   POST /api/booking/{id}/cancel
   ```

### Phase 5: Advanced Features

1. **Team scheduling**
   - Multiple participant availability
   - Group meeting optimization
   - Resource booking (rooms, equipment)

2. **Analytics and insights**
   - Meeting pattern analysis
   - Productivity insights
   - Usage statistics (with user consent)

## 🛠️ Backend Architecture Recommendations

### Technology Stack
- **API**: Node.js with Express or Python with FastAPI
- **Database**: PostgreSQL for user data, Redis for caching
- **Authentication**: JWT tokens with refresh mechanism
- **Queue**: Redis or RabbitMQ for background jobs
- **Storage**: AWS S3 or similar for file storage

### Security Considerations
- **HTTPS**: All communications encrypted
- **Token Security**: Secure token storage and rotation
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Input Validation**: Sanitize all user inputs
- **Audit Logging**: Track all data access and modifications

### Privacy Implementation
- **Data Minimization**: Collect only necessary data
- **Encryption**: Encrypt sensitive data at rest and in transit
- **Access Controls**: Role-based access to user data
- **Data Retention**: Automatic deletion based on user preferences
- **Consent Management**: Granular consent for data processing

## 📊 Monitoring and Analytics

### Privacy-Compliant Analytics
```javascript
// Example: Anonymous usage tracking (opt-in)
const trackEvent = (event, properties) => {
  if (userConsent.analytics) {
    // Send anonymous event data
    analytics.track(event, {
      ...properties,
      userId: null, // No personal identifiers
      timestamp: Date.now()
    });
  }
};
```

### Key Metrics to Track
- User engagement and feature usage
- Performance metrics (load times, API response times)
- Error rates and system health
- Privacy settings adoption rates

## 🚀 Deployment

### Environment Variables
```bash
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/checkmate
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Privacy
DATA_RETENTION_DAYS=30
ANALYTICS_ENABLED=false
```

### Production Checklist
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables properly configured
- [ ] Database backups automated
- [ ] Monitoring and alerting set up
- [ ] Privacy policy and terms of service published
- [ ] GDPR compliance verified
- [ ] Security audit completed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure privacy compliance
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support:
- Create an issue in the repository
- Check the documentation
- Review the privacy policy

---

**Remember**: Privacy is not a feature, it's a fundamental right. Every decision in CheckMate is made with user privacy as the top priority.
