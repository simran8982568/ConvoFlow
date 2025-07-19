# AyuChat - Message Automation Command Center

A comprehensive WhatsApp Business API management platform with role-based access control for administrators and super administrators.

## 🚀 Overview

AyuChat is a modern, React-based web application designed to streamline WhatsApp Business API operations. The platform provides powerful tools for message automation, campaign management, contact organization, and business analytics through an intuitive, role-based interface.

### Key Features

- **Role-Based Architecture**: Separate interfaces and permissions for Admin and Super Admin users
- **Campaign Management**: Create, schedule, and monitor WhatsApp marketing campaigns
- **Contact Management**: Import/export contacts with CSV/XLSX support
- **Template System**: Create and manage WhatsApp message templates with media support
- **Automation Workflows**: Build complex message automation sequences
- **Real-time Analytics**: Comprehensive reporting and performance insights
- **Phone Number Management**: Manage WhatsApp Business API connections
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🏗️ Architecture

### Role-Based Structure

The application implements a clean separation between two user roles:

#### Admin Role
- **Path**: `/admin/*`
- **Features**: Campaign management, contact handling, template creation, automation workflows
- **Pages**: Dashboard, Inbox, Campaigns, Contacts, Automation, Templates, Phone Numbers, Analytics, Billing, Settings

#### Super Admin Role
- **Path**: `/superadmin/*`
- **Features**: Business oversight, template moderation, platform analytics, plan management
- **Pages**: Dashboard, Businesses, Templates, Analytics, Plans, Logs, Settings

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Components**: Custom component library built on Radix UI
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with validation
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── admin/              # Admin login/signup forms
│   │   └── superadmin/         # Super admin authentication
│   ├── common/                 # Shared components
│   │   ├── ResponsiveSidebar.tsx
│   │   ├── UserHeader.tsx
│   │   ├── admin/              # Admin-specific shared components
│   │   └── superadmin/         # Super admin shared components
│   ├── layouts/                # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── SuperAdminLayout.tsx
│   │   └── shared/
│   ├── pageswise/              # Page-specific components
│   │   ├── admin/              # Admin pages
│   │   │   ├── campaigns/      # Campaign management
│   │   │   ├── contacts/       # Contact management
│   │   │   ├── templates/      # Template creation/editing
│   │   │   ├── automation/     # Workflow automation
│   │   │   ├── inbox/          # Message conversations
│   │   │   ├── phonenumbers/   # Phone number management
│   │   │   ├── analytics/      # Performance analytics
│   │   │   ├── billing/        # Billing and subscriptions
│   │   │   └── settings/       # Account settings
│   │   └── superadmin/         # Super admin pages
│   │       ├── businesses/     # Business directory
│   │       ├── templates/      # Template moderation
│   │       ├── analytics/      # Platform analytics
│   │       ├── plans/          # Subscription plans
│   │       └── logs/           # System logs
│   └── ui/                     # Reusable UI components
├── state/                      # Redux store configuration
│   ├── admin/                  # Admin-specific state
│   │   ├── store.ts
│   │   └── slices/
│   └── superadmin/             # Super admin state
│       ├── store.ts
│       └── slices/
├── utils/                      # Utility functions
│   ├── auth/                   # Authentication utilities
│   │   ├── admin.ts
│   │   ├── superadmin.ts
│   │   └── auth.ts
│   └── lib/
├── hooks/                      # Custom React hooks
├── api/                        # API integration
└── layouts/                    # Main layout components
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd message-automation-command-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Run deployment readiness check
npm run deploy:check

# Build for production
npm run build

# Build with production environment
npm run build:prod
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Prepare for deployment:**
   ```bash
   npm run deploy:check
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run deploy:vercel
   ```

3. **Manual Vercel deployment:**
   ```bash
   npm run build
   vercel --prod
   ```

### Environment Variables

Copy `.env.example` to `.env.production` and configure:

```bash
# Required for production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Your App Name
VITE_BRAND_COLOR=teal
```

### Deployment Checklist

- ✅ All assets are in `/public/assets/` directory
- ✅ No hardcoded `file://` URLs in code
- ✅ Environment variables configured
- ✅ Vercel configuration is correct
- ✅ Build passes without errors
- ✅ Type checking passes

### Troubleshooting Deployment Issues

**Error: `net::ERR_FILE_NOT_FOUND`**
- Ensure all assets are in the `/public` directory
- Use relative paths starting with `/assets/`
- Check that `vite.config.ts` has correct `base` and `publicDir` settings

**Error: `Uncaught (in promise) Error: A listener indicated an asynchronous response`**
- This is typically from browser extensions, not your app
- Can be safely ignored in production

**Build Errors:**
- Run `npm run type-check` to identify TypeScript issues
- Run `npm run lint:fix` to fix linting issues
- Ensure all imports use correct paths

## 🔐 Authentication

### Admin Access
- **URL**: `/admin/login`
- **Default Credentials**: Use any valid email/password combination (development mode)

### Super Admin Access
- **URL**: `/superadmin/login`
- **Default Credentials**: 
  - Email: `superadmin@ayuchat.com`
  - Password: `superadmin123`

## 🎯 Key Features by Role

### Admin Features

#### 📧 Inbox Management
- Clean, scrollable message conversations
- Responsive layout that adapts to screen size
- Easy navigation between message threads
- Quick reply functionality

#### 📢 Campaign Management
- **Interactive Campaign Cards** with:
  - Pause button (turns card red when paused)
  - Edit modal for campaign modifications
  - Analytics slide-down with animated charts
  - Delete confirmation dialogs

#### 👥 Contact Management
- **Import/Export Functionality**:
  - CSV/XLSX file import with format validation
  - Export contacts to CSV format
  - Error handling and confirmation messages
  - File format descriptions and validation

#### 📝 Template System
- **Comprehensive Template Creation**:
  - Support for text, images, videos, and GIFs
  - WhatsApp-style preview modal
  - Edit modal for template modifications
  - Delete confirmation with impact warnings

#### 🤖 Automation Workflows
- **Interactive Automation Cards**:
  - Edit modal for workflow modifications
  - Pause button with red background indication
  - Analytics slide-down with performance graphs
  - Visual workflow builder

#### 📱 Phone Number Management
- **Phone Number Cards** with actions:
  - Test Connection functionality
  - Refresh connection status
  - Configuration management
  - Log viewing capabilities
  - Remove phone number option

### Super Admin Features

#### 🏢 Business Management
- **Enhanced Business Directory**:
  - Real-time search functionality
  - Export business data to CSV
  - Comprehensive business oversight

#### 📋 Template Moderation
- **Advanced Template Management**:
  - All admin template features
  - Approve/Reject template actions
  - Search functionality in template queue
  - Business compliance monitoring

#### 📊 Platform Analytics
- **Advanced Reporting**:
  - Month filter for report customization
  - Export formatted analytics data
  - Platform-wide performance insights

#### 💳 Plan Management
- **Subscription Management**:
  - Plan card management
  - Delete plans with confirmation
  - Subscription analytics

## 🎨 UI/UX Features

### Consistent Layout
- **User Details Display**: Name and profile information consistently shown in top-right corner above refresh buttons
- **Responsive Sidebar**: Adapts to different screen sizes with mobile-friendly navigation
- **Role-Based Theming**: Admin (teal) and Super Admin (purple) color schemes

### Interactive Elements
- **Animated Transitions**: Smooth slide-down animations for analytics sections
- **Loading States**: Comprehensive loading indicators for all async operations
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Confirmation Dialogs**: Prevent accidental deletions and destructive actions

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Responsive Design**: Works seamlessly across all device sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Organization

- **Component Structure**: Each feature has its own folder with related components
- **State Management**: Redux slices organized by feature and role
- **Type Safety**: Comprehensive TypeScript coverage
- **Reusable Components**: Shared UI components for consistency

## 📈 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Vite-powered fast builds and hot reloading
- **Bundle Analysis**: Built-in bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

---

**AyuChat** - Streamlining WhatsApp Business Communication
