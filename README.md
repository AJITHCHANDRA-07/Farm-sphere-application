# 🌾 FarmSphere - Smart Agriculture Platform

A comprehensive agricultural platform designed to empower farmers in Telangana with data-driven insights, real-time weather information, and personalized crop recommendations.

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technologies Used](#️-technologies-used)
- [🌐 Multi-Language Support](#-multi-language-support)
- [🎨 UI Components & Design](#-ui-components--design)
- [📱 Responsive Design](#-responsive-design)
- [🔐 Authentication](#-authentication)
- [📊 Database Integration](#-database-integration)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)

---

## 🌟 Features

### 🏠 Core Features
- **Multi-Language Support**: English, Hindi, and Telugu
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-Time Data**: Weather updates and market prices
- **Crop Recommendations**: AI-powered suggestions based on location
- **Marketplace**: Connect farmers with buyers directly
- **Government Schemes**: Access to agricultural subsidies and programs

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design patterns
- **Professional Backgrounds**: Attractive agricultural imagery

### 📱 Key Pages
- **Home**: Hero section with feature highlights and navigation buttons
- **About**: Company information with agricultural background images
- **Services**: Agricultural services overview with professional styling
- **Marketplace**: Trading platform for farmers and buyers
- **Contact**: Professional contact form with validation
- **Profile**: User dashboard and settings management

---

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Supabase account (for database and authentication)

### 🔧 Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/farmsphere-visions.git
cd farmsphere-visions-main
```

### 📦 Step 2: Install Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 🔑 Step 3: Environment Setup
Create a `.env.local` file in the frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🗄️ Step 4: Database Setup
1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env.local`
3. Run the provided SQL migration scripts in Supabase SQL Editor
4. Set up authentication providers (Email, Google, Facebook)
5. Configure storage buckets for profile images and documents

### 🚀 Step 5: Run Development Server
```bash
# Start the development server
npm run dev
# or
yarn dev

# The application will be available at:
# http://localhost:5173
```

### 🏗️ Step 6: Build for Production
```bash
# Build the application
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

---

## 📁 Project Structure

```
farmsphere-visions-main/
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components (Button, Input, etc.)
│   │   │   ├── Header.tsx    # Navigation header with language switcher
│   │   │   ├── HeroSection.tsx # Main hero component
│   │   │   ├── HighDemandCropsTeaser.tsx
│   │   │   ├── StateAnalyticsSection.tsx
│   │   │   ├── InvestmentSection.tsx
│   │   │   └── GovernmentSchemesSection.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── About.tsx     # About page with background images
│   │   │   ├── Contact.tsx   # Contact page with professional styling
│   │   │   ├── Services.tsx  # Services page
│   │   │   ├── Index.tsx     # Home page
│   │   │   ├── ExploreSchemes.tsx
│   │   │   └── Marketplace.tsx
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext.tsx # Authentication state management
│   │   │   └── LanguageContext.tsx # Language switching
│   │   ├── lib/              # Utility libraries
│   │   │   ├── translations.ts # Multi-language support (EN/HI/TE)
│   │   │   └── supabase.ts   # Database client configuration
│   │   ├── assets/           # Static assets and images
│   │   └── styles/           # Global CSS and Tailwind config
│   ├── public/               # Public assets and favicon
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Build configuration
├── docs/                      # Documentation files
├── README.md                  # This comprehensive guide
└── package.json              # Root package configuration
```

---

## 🛠️ Technologies Used

### 🎨 Frontend Stack
- **React 18**: Modern UI framework with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server with HMR
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Modern, consistent icon library

### 🗄️ Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **PostgreSQL**: Robust relational database
- **Real-time Subscriptions**: Live data updates across clients
- **File Storage**: Image and document management

### 🌐 State Management & APIs
- **React Context**: Global state management for auth and language
- **Custom Hooks**: Reusable state logic and API calls
- **REST APIs**: Supabase auto-generated API endpoints

### 📦 Development Tools
- **ESLint**: Code linting and formatting for consistency
- **TypeScript**: Static type checking and IntelliSense
- **Vite**: Hot module replacement and optimized bundling

---

## 🌐 Multi-Language Support

### 🗣️ Supported Languages
- **English** (en): Default language with full coverage
- **Hindi** (hi): हिंदी - Complete Hindi translations
- **Telugu** (te): తెలుగు - Complete Telugu translations

### 📝 Translation Implementation
All translations are centralized in `src/lib/translations.ts`:

```typescript
const translations = {
  en: {
    header: {
      home: "Home",
      aboutUs: "About Us",
      services: "Services",
      marketplace: "Marketplace",
      contact: "Contact"
    },
    about: {
      hero: {
        title: "Empowering Farmers with Smart Agriculture",
        subtitle: "Your Complete Agricultural Solution"
      }
    }
  },
  hi: {
    header: {
      home: "होम",
      aboutUs: "हमारे बारे में",
      services: "सेवाएं",
      marketplace: "मार्केटप्लेस",
      contact: "संपर्क"
    },
    about: {
      hero: {
        title: "स्मार्ट कृषि के साथ किसानों को सशक्त बनाना",
        subtitle: "आपका पूर्ण कृषि समाधान"
      }
    }
  },
  te: {
    header: {
      home: "హోమ్",
      aboutUs: "మా గురించి",
      services: "సేవలు",
      marketplace: "మార్కెట్‌ప్లేస్",
      contact: "సంప్రదించండి"
    },
    about: {
      hero: {
        title: "స్మార్ట్ వ్యవసాయంతో రైతులను సమర్థవంతం చేయడం",
        subtitle: "మీ సంపూర్ణ వ్యవసాయ పరిష్కారం"
      }
    }
  }
};
```

### 🔧 Adding New Translations
1. Add translation keys to all language objects in `translations.ts`
2. Use the `useTranslation` hook in components: `const { t } = useTranslation(currentLanguage);`
3. Apply translations: `{t('header.home')}`
4. Test all languages to ensure consistency

---

## 🎨 UI Components & Design

### 🧩 Component Architecture
- **Base Components**: Reusable UI components in `src/components/ui/`
  - `Button`: Multiple variants (professional, clean, outline)
  - `Input`: Form inputs with validation states
  - `Card`: Flexible card layouts
  - `Modal`: Dialog components with overlays
  - `Dropdown`: Menu components with keyboard navigation

### 🎭 Custom Business Components
- **Header**: Navigation with language switcher and user profile
- **HeroSection**: Landing page hero with animated elements
- **Feature Cards**: Service showcase with hover effects
- **ContactForm**: Multi-field form with real-time validation

### 🎨 Design System
- **Color Palette**: Green-focused agricultural theme
  - Primary: `#16a34a` (green-600)
  - Secondary: `#14532d` (green-900)
  - Accent: Yellow and earth tones
- **Typography**: System fonts with proper fallbacks
- **Spacing**: Consistent Tailwind spacing scale
- **Animations**: Smooth transitions and micro-interactions

### 🖼️ Image Optimization
- **Lazy Loading**: `loading="lazy"` attribute for performance
- **Fetch Priority**: `fetchpriority="high"` for critical images
- **Responsive Images**: Proper sizing and formats
- **Background Images**: Professional agricultural imagery with opacity

---

## 📱 Responsive Design

### 📲 Mobile-First Approach
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
  - Large Desktop: > 1280px

### 🔄 Adaptive Components
- **Header**: 
  - Mobile: Hamburger menu with slide-out navigation
  - Desktop: Full navigation with bold text
- **Navigation Buttons**: Responsive sizing and text truncation
- **Cards**: Grid layouts that reflow based on screen size
- **Forms**: Responsive input fields and button layouts

### 🎯 Mobile Optimizations
- **Touch-Friendly**: Minimum 44px touch targets
- **Readable Text**: Proper font sizes for mobile screens
- **Performance**: Optimized images and lazy loading
- **Navigation**: Intuitive mobile menu patterns

---

## 🔐 Authentication

### 🔑 User Management
- **Registration**: Email/password with validation
- **Login**: Secure authentication with session management
- **Social Login**: Google and Facebook integration
- **Password Reset**: Email-based password recovery

### 👤 User Profiles
- **Farmer Profiles**: Agricultural information and farm details
- **Business Profiles**: Commercial user information
- **Profile Completion**: Guided setup process with progress tracking
- **Avatar Management**: Profile picture upload and cropping

### 🛡️ Security Features
- **Session Management**: Secure JWT token handling
- **Role-Based Access**: Different permissions for user types
- **Data Validation**: Input sanitization and XSS protection
- **Privacy Controls**: GDPR-compliant data management

---

## 📊 Database Integration

### 🗄️ Supabase Features
- **Real-time Subscriptions**: Live data updates across clients
- **File Storage**: Image and document management with CDN
- **Authentication**: Built-in user management and social providers
- **API Generation**: Auto-generated REST APIs with PostgREST

### 📋 Database Schema
- **users**: Authentication and basic user information
- **profiles**: Extended user data (farm details, business info)
- **crops**: Crop database with recommendations
- **market_prices**: Real-time agricultural market data
- **schemes**: Government program and subsidy information
- **messages**: Contact form submissions and communications

### 🔗 External APIs
- **Weather Services**: Real-time weather data and forecasts
- **Market Data**: Agricultural commodity prices
- **Government APIs**: Scheme and subsidy information

---

## 🚀 Deployment

### 🌦️ Environment Configuration
```bash
# Development (.env.local)
VITE_SUPABASE_URL=your_dev_supabase_url
VITE_SUPABASE_ANON_KEY=your_dev_supabase_key
VITE_APP_ENV=development

# Production (.env.production)
VITE_SUPABASE_URL=your_prod_supabase_url
VITE_SUPABASE_ANON_KEY=your_prod_supabase_key
VITE_APP_ENV=production
```

### 📦 Build Process
```bash
# Development server with hot reload
npm run dev

# Production build optimization
npm run build

# Build analysis for bundle optimization
npm run build -- --analyze

# Preview production build locally
npm run preview
```

### 🚀 Deployment Platforms
- **Vercel**: Recommended for React applications with automatic CI/CD
- **Netlify**: Static site hosting with form handling
- **AWS S3 + CloudFront**: Custom deployment with CDN
- **Docker**: Containerized deployment for scaling

### 🔧 Deployment Steps
1. **Prepare Environment**: Set up production environment variables
2. **Build Application**: Run `npm run build`
3. **Configure Database**: Set up production Supabase instance
4. **Deploy**: Push to hosting platform
5. **Test**: Verify all functionality in production
6. **Monitor**: Set up error tracking and analytics

---

## 🤝 Contributing

### 📋 Development Workflow
1. **Fork** the repository to your GitHub account
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with proper commit messages
4. **Test** thoroughly on multiple devices and browsers
5. **Submit** a pull request with detailed description

### 🐛 Bug Reporting
- Use GitHub Issues with proper labels
- Include screenshots and reproduction steps
- Provide browser, device, and OS information
- Add error logs and console output if available

### 💡 Feature Requests
- Submit detailed requirements via GitHub Issues
- Include user stories and acceptance criteria
- Discuss implementation approach before development
- Consider multi-language implications

### 📝 Code Standards
- **TypeScript**: Use strict type checking
- **ESLint**: Follow configured linting rules
- **Components**: Keep components small and focused
- **Translations**: Add all three languages for new text
- **Testing**: Test on mobile, tablet, and desktop

---

## 📞 Support

### 🆘 Getting Help
- **Documentation**: Read this README thoroughly
- **GitHub Issues**: Report bugs and request features
- **Community**: Join our developer discussions
- **Email**: Contact the development team directly

### 📧 Contact Information
- **Project Maintainer**: FarmSphere Development Team
- **Technical Support**: support@farmsphere.com
- **Business Inquiries**: business@farmsphere.com
- **Website**: https://farmsphere.com

### 🔄 Updates & Maintenance
- **Regular Updates**: Monthly feature releases
- **Security Updates**: Prompt vulnerability patches
- **Performance**: Regular optimization improvements
- **Documentation**: Updated with each release

---

## 🎉 Acknowledgments

- **Supabase Team** for the excellent backend-as-a-service platform
- **Tailwind CSS** for the amazing utility-first CSS framework
- **React Community** for the incredible ecosystem and tools
- **Telangana Farmers** for their valuable feedback and insights
- **Open Source Community** for the tools and libraries that make this project possible

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.

### 🎯 License Summary
- ✅ Commercial use allowed
- ✅ Modification and distribution allowed
- ✅ Private use allowed
- ❌ No warranty or liability provided

---

**Made with ❤️ for the farming community in Telangana**

*Empowering farmers with smart agriculture technology and data-driven insights*

---

## 🚀 Quick Start Summary

```bash
# Clone and setup
git clone https://github.com/your-username/farmsphere-visions.git
cd farmsphere-visions-main/frontend
npm install

# Configure environment
echo "VITE_SUPABASE_URL=your_url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env.local

# Start development
npm run dev
# Visit http://localhost:5173
```

*Ready to transform agriculture in Telangana with technology! 🌾*
- npm or bun
- Database (PostgreSQL recommended)

### Installation

1. Install dependencies for all packages:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
# Copy backend env template
cp backend/.env.example backend/.env
# Configure your database connection
```

3. Set up database:
```bash
# Run database migrations
cd database
# Execute SQL files in order:
# 1. create-6-table-schema.sql
# 2. insert-data.sql
# 3. add-all-missing-columns.sql
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

Or start individually:
```bash
npm run dev:frontend  # Frontend at http://localhost:5173
npm run dev:backend   # Backend at http://localhost:3001
```

### Production

Build and deploy:
```bash
npm run build:frontend
npm run start:backend
```

## Features

- **Crop Management**: Browse and manage crop information
- **Market Insights**: Get real-time market data and pricing
- **Supply Chain Optimization**: Connect farmers with buyers
- **Government Schemes**: Access agricultural subsidies and programs
- **District Suitability**: Find crops suitable for your region

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons

### Backend
- Node.js
- Express
- PostgreSQL
- Ollama AI Integration

### Database
- PostgreSQL
- SQL Schema Files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
