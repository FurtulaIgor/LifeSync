# LifeSync Deployment Guide

This guide covers the complete process for deploying LifeSync to production, including build optimization, deployment options, and monitoring.

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git repository access
- Chosen deployment platform account (Vercel, Netlify, etc.)

## 🔧 Pre-Deployment Checklist

Run the health check to ensure everything is ready:
```bash
npm run health-check
```

This command will:
- ✅ Type-check TypeScript files
- ✅ Run ESLint for code quality
- ✅ Build the production bundle
- ✅ Verify no critical errors

## 🚀 Build for Production

### Standard Production Build
```bash
npm run build
```

### Clean Build (if needed)
```bash
npm run clean
npm install
npm run build
```

### Build Analysis
```bash
npm run build:analyze
```

## 📦 Production Bundle Optimization

The production build includes:

- **Minification**: JavaScript and CSS are minified using esbuild
- **Code Splitting**: Vendor libraries and charts are split into separate chunks
- **Asset Optimization**: Images and static assets are optimized
- **Tree Shaking**: Unused code is removed
- **Chunk Splitting**: Better caching with separate vendor and feature chunks

Expected build output:
- Bundle size: ~500-800KB (gzipped)
- Vendor chunk: ~150-300KB (React, React-DOM)
- Charts chunk: ~100-200KB (Recharts)
- Main app: ~200-300KB

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite and configure build settings
3. Every push to `main` branch triggers automatic deployment

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
npm run deploy:vercel
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": ".*", "dest": "/index.html" }
  ]
}
```

### Option 2: Netlify

**Automatic Deployment:**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

**Manual Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to production
npm run deploy:netlify
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (using gh-pages)
npm install -g gh-pages
gh-pages -d dist
```

### Option 4: Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔍 Production Testing

### Local Production Preview
```bash
npm run preview:production
```
Visit: `http://localhost:4173`

### Testing Checklist

- [ ] **Performance**: Load time < 3 seconds
- [ ] **Mobile Responsive**: Test on multiple device sizes
- [ ] **Functionality**: All features work correctly
- [ ] **Analytics**: Charts render properly
- [ ] **Data Persistence**: Local storage works
- [ ] **Accessibility**: Screen reader compatibility
- [ ] **Cross-Browser**: Chrome, Firefox, Safari, Edge

### Performance Monitoring

Use these tools to monitor production performance:
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Lighthouse**: Run regular performance audits
- **Vercel Analytics**: Built-in performance monitoring (if using Vercel)

## 📊 Production Configuration

### Environment Variables

Create `.env.production` for production-specific settings:
```bash
# Analytics
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_HOTJAR_ID=your-hotjar-id

# Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn

# Feature Flags
VITE_ENABLE_DEVELOPMENT_TOOLS=false
```

### Security Headers

Recommended security headers for your deployment:
```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🔄 Deployment Workflow

### Automated CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run health check
        run: npm run health-check
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Manual Deployment Steps

1. **Code Review & Testing**
   ```bash
   git checkout main
   git pull origin main
   npm run health-check
   ```

2. **Version Management**
   ```bash
   npm version patch  # or minor/major
   git push --tags
   ```

3. **Deploy**
   ```bash
   npm run build
   npm run deploy:vercel  # or chosen platform
   ```

4. **Post-Deployment Verification**
   - Check production URL
   - Verify all features work
   - Monitor error rates
   - Test performance

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version compatibility
- Clear cache: `npm run clean && npm install`
- Check for TypeScript errors: `npm run type-check`

**Large Bundle Size:**
- Review chunk splitting configuration
- Use bundle analyzer: `npm run build:analyze`
- Consider lazy loading for charts

**Performance Issues:**
- Enable compression on server
- Implement service worker for caching
- Optimize images and assets

**Mobile Issues:**
- Test responsive design with real devices
- Check touch target sizes (minimum 44px)
- Verify form behavior on mobile

## 📈 Post-Deployment Monitoring

### Key Metrics to Track

- **Performance**: Page load time, Core Web Vitals
- **Usage**: Daily/Monthly active users
- **Errors**: JavaScript errors, failed requests
- **Features**: Task completion rates, mood tracking usage
- **Mobile**: Mobile vs desktop usage patterns

### Monitoring Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking and performance monitoring
- **Hotjar**: User session recordings and heatmaps

## 🔄 Rollback Procedure

If issues arise after deployment:

1. **Immediate Rollback** (Vercel):
   ```bash
   vercel rollback [deployment-url]
   ```

2. **Git-based Rollback**:
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

3. **Emergency Hotfix**:
   - Create hotfix branch
   - Apply minimal fix
   - Deploy directly to production
   - Merge back to main

## ✅ Deployment Complete

After successful deployment:

- [ ] Production URL is accessible
- [ ] All features tested and working
- [ ] Performance metrics are acceptable
- [ ] Error monitoring is active
- [ ] Team notified of deployment
- [ ] Documentation updated

---

## 🆘 Support

For deployment issues:
1. Check this documentation
2. Review build logs
3. Check platform-specific docs (Vercel/Netlify)
4. Contact platform support if needed

**Deployment Status**: Ready for Production 🚀 