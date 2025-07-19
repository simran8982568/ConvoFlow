# Navigation System Guide

## Overview

This React application features a comprehensive role-based navigation system with responsive design, supporting both Admin and SuperAdmin roles with dedicated page components and routing.

## Architecture

### Role-Based Routing

The application uses React Router v6 with nested routes:

- **Admin Routes**: Prefixed with `/admin/`
- **SuperAdmin Routes**: Prefixed with `/superadmin/`
- **Authentication**: Separate login pages for each role

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── ResponsiveSidebar.tsx     # Main navigation component
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx      # Legacy admin sidebar
│   │   └── superadmin/
│   │       └── SuperAdminSidebar.tsx # Legacy superadmin sidebar
│   └── pageswise/
│       ├── admin/                    # Admin page components
│       │   ├── dashboard/
│       │   ├── inbox/
│       │   ├── campaigns/
│       │   ├── contacts/
│       │   ├── automation/
│       │   ├── templates/
│       │   ├── phone-numbers/
│       │   ├── analytics/
│       │   ├── billing/
│       │   └── settings/
│       └── superadmin/               # SuperAdmin page components
│           ├── dashboard/
│           ├── businesses/
│           ├── templates/
│           ├── analytics/
│           ├── plans/
│           ├── logs/
│           └── settings/
├── layouts/
│   ├── AdminLayout.tsx               # Admin layout wrapper
│   └── SuperAdminLayout.tsx          # SuperAdmin layout wrapper
└── utils/
    └── auth.ts                       # Authentication service
```

## Features

### 🎯 Role-Based Navigation

- **Admin Panel**: 10 main sections including Dashboard, Inbox, Campaigns, Contacts, etc.
- **SuperAdmin Panel**: 7 main sections including Dashboard, Businesses, Plans, Logs, etc.
- **Protected Routes**: Each role can only access their designated pages
- **Authentication**: Mock authentication system with role-based login

### 📱 Responsive Design

- **Desktop**: Fixed sidebar with full navigation
- **Mobile**: Collapsible hamburger menu with overlay
- **Tablet**: Adaptive layout that works on all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions

### 🎨 UI/UX Features

- **Active State Highlighting**: Current page is visually highlighted in navigation
- **Consistent Branding**: Different colors for Admin (teal) vs SuperAdmin (purple)
- **Smooth Transitions**: Animated menu interactions
- **Accessibility**: Keyboard navigation and screen reader support

## Usage

### Navigation Testing

Visit `/test` to access the navigation test page that allows you to:
- Test all admin routes
- Test all superadmin routes
- Verify authentication flows
- Check responsive behavior

### Route Structure

#### Admin Routes
```
/admin/login          # Admin login page
/admin/dashboard      # Main dashboard
/admin/inbox          # Message inbox
/admin/campaigns      # Campaign management
/admin/contacts       # Contact management
/admin/automation     # Workflow automation
/admin/templates      # Message templates
/admin/phone-numbers  # Phone number management
/admin/analytics      # Analytics and reporting
/admin/billing        # Billing and subscriptions
/admin/settings       # Account settings
```

#### SuperAdmin Routes
```
/superadmin/login     # SuperAdmin login page
/superadmin/dashboard # Platform overview
/superadmin/businesses # Business management
/superadmin/templates # Template approval
/superadmin/analytics # Platform analytics
/superadmin/plans     # Subscription plans
/superadmin/logs      # System logs
/superadmin/settings  # Platform settings
```

## Development

### Adding New Pages

1. **Create Component**: Add new component in appropriate folder structure
2. **Export Component**: Update the index.tsx file in the folder
3. **Add Route**: Add route to App.tsx
4. **Update Sidebar**: Add navigation link to ResponsiveSidebar.tsx

### Customizing Navigation

The `ResponsiveSidebar` component accepts a `role` prop and automatically:
- Renders appropriate menu items
- Applies correct branding colors
- Handles role-specific logout redirects

### Mobile Optimization

The responsive design automatically:
- Shows hamburger menu on screens < 768px
- Provides overlay navigation on mobile
- Maintains desktop sidebar on larger screens
- Adapts spacing and typography for mobile

## Authentication

The application uses a mock authentication system (`src/utils/auth.ts`) that:
- Stores user data in localStorage
- Provides role-based access control
- Handles login/logout flows
- Maintains session state

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Code Splitting**: Each page component is loaded on demand
- **Lazy Loading**: Routes are loaded as needed
- **Optimized Rendering**: Efficient re-renders with React hooks
- **Mobile Performance**: Optimized for touch devices

## Troubleshooting

### Common Issues

1. **Route Not Found**: Ensure component is properly exported and imported in App.tsx
2. **Sidebar Not Showing**: Check if ResponsiveSidebar is included in layout
3. **Mobile Menu Not Working**: Verify screen size detection and state management
4. **Authentication Issues**: Check localStorage and auth service implementation

### Development Server

```bash
npm run dev  # Start development server on http://localhost:8080
```

The application supports hot module replacement (HMR) for instant updates during development.
