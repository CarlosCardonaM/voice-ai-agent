# Voice AI Agent Frontend

A professional, Retell-like React frontend for managing and monitoring your Voice AI Agent platform.

## 🚀 Features

### 📊 Dashboard
- **Real-time Metrics**: Active calls, response times, success rates
- **Quick Actions**: Start calls, configure agent, view analytics
- **Recent Activity**: Live call monitoring and system events
- **System Status**: Service health and performance indicators

### 🔧 Builder
- **Agent Configuration**: Customize voice, language, and behavior
- **Language Settings**: Multi-language support with auto-detection
- **Voice Settings**: TTS voice selection and speech parameters
- **STT Configuration**: Speech recognition model and options
- **LLM Settings**: AI model selection and system prompts
- **Performance Tuning**: Latency targets and optimization

### 🧪 Testing
- **Test Scenarios**: Customer service, reservations, technical support
- **Language Testing**: Spanish, English, and mixed language scenarios
- **Performance Testing**: Response time and accuracy validation
- **Real-time Logs**: Detailed test execution monitoring

### 🚀 Deploy
- **Environment Management**: Development, staging, production
- **Cloud Deployment**: AWS, GCP, Azure support
- **Infrastructure**: Auto-scaling, load balancing, monitoring
- **Deployment Pipeline**: Step-by-step deployment process

### 📈 Monitor
- **Live Call Monitoring**: Real-time call status and metrics
- **Performance Analytics**: Response times, success rates, language switches
- **System Health**: Service status and infrastructure monitoring
- **Call Management**: Active call overview and actions

### ⚙️ Settings
- **API Management**: Secure API key storage and testing
- **System Configuration**: Logging, analytics, notifications
- **Security Settings**: Authentication, session management, audit logs
- **System Information**: Version details and environment status

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Charts**: Recharts (planned)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2) - Main actions and branding
- **Secondary**: Pink (#dc004e) - Accent elements
- **Success**: Green - Positive states and confirmations
- **Warning**: Orange - Caution and alerts
- **Error**: Red - Errors and critical issues
- **Info**: Light Blue - Information and neutral states

### Typography
- **Font Family**: Roboto (Material Design standard)
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability
- **Captions**: Smaller text for secondary information

### Components
- **Cards**: Elevated containers with rounded corners
- **Buttons**: Consistent styling with icons and states
- **Forms**: Material Design form controls
- **Tables**: Responsive data tables
- **Charts**: Data visualization components

## 🔌 API Integration

### Backend Endpoints
The frontend integrates with your Python Voice AI Agent backend:

- **Dashboard Data**: `/health`, `/performance`
- **Agent Configuration**: `/api/config`
- **Testing**: `/api/test`
- **Deployment**: `/api/deploy`
- **Monitoring**: `/api/monitor`
- **Settings**: `/api/settings`

### Real-time Updates
- WebSocket connections for live call monitoring
- Server-sent events for performance metrics
- Polling for system status updates

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0px - 600px
- **Tablet**: 600px - 960px
- **Desktop**: 960px+

### Mobile Features
- Collapsible sidebar navigation
- Touch-friendly controls
- Optimized layouts for small screens
- Swipe gestures for navigation

## 🚀 Performance

### Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Compressed and optimized images

### Monitoring
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Error boundary and logging
- **Analytics**: User interaction tracking
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Security

### Features
- **API Key Masking**: Secure display of sensitive data
- **Input Validation**: Form validation and sanitization
- **HTTPS**: Secure communication protocols
- **Session Management**: Secure session handling

### Best Practices
- Environment variable management
- Secure API key storage
- Input sanitization
- XSS protection

## 🧪 Testing

### Test Types
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: Screen reader compatibility

### Test Coverage
- Component rendering
- User interactions
- API calls
- Error handling
- Responsive behavior

## 📦 Deployment

### Build Process
```bash
# Create production build
npm run build

# Build analysis
npm run analyze

# Preview build
npm run preview
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Cloud Platforms**: AWS S3, Google Cloud Storage
- **CDN**: Cloudflare, AWS CloudFront
- **Container**: Docker containers for full-stack deployment

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_MONITORING=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Customization
- Theme customization
- Component overrides
- Layout modifications
- Feature toggles

## 📚 Documentation

### Component Library
- Storybook integration for component documentation
- Interactive examples and props documentation
- Design system guidelines
- Accessibility guidelines

### API Documentation
- OpenAPI/Swagger integration
- Interactive API testing
- Request/response examples
- Error code documentation

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- ESLint configuration
- Prettier formatting
- TypeScript (planned)
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and component docs
- **Issues**: Report bugs and feature requests
- **Discussions**: Community support and questions
- **Email**: Direct support contact

### Troubleshooting
- Common setup issues
- Performance problems
- Browser compatibility
- Mobile responsiveness

---

**Built with ❤️ for Voice AI Agents**
