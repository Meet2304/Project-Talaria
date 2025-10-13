# Talaria - Deployment Guide

## 🚀 Vercel Deployment

Talaria is optimized for deployment on Vercel with zero-configuration setup.

---

## Prerequisites

- [Vercel Account](https://vercel.com) (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)
- Firebase project configured
- Vertex AI endpoint (optional, for ML features)

---

## Quick Deploy

### Method 1: Via Vercel Dashboard

1. **Import Project**
   - Go to https://vercel.com/new
   - Click **Import Git Repository**
   - Select your repository
   - Set **Root Directory** to `Project-Talaria/Talaria`
   - Click **Import**

2. **Configure Build Settings**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node.js Version: **18.x**

3. **Click Deploy**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd Project-Talaria/Talaria

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Confirm project settings
```

---

## Environment Variables Setup

After initial deployment, configure environment variables:

### 1. Navigate to Project Settings
- Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

### 2. Add Required Variables

#### Firebase Configuration (Required)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### Google Cloud Vertex AI (Optional - for ML features)

```bash
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_ENDPOINT_ID=1234567890123456789
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key":"-----BEGIN PRIVATE KEY-----\n..."}
```

### 3. Set Environment Scope

For each variable, select environments:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

### 4. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Select **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

---

## Verification Checklist

After deployment completes:

### ✅ Core Functionality
- [ ] Homepage loads at your Vercel URL
- [ ] Navigation works across all pages
- [ ] Images load correctly
- [ ] Responsive design works on mobile

### ✅ Firebase Integration
- [ ] `/dashboard/database` connects successfully
- [ ] Can view devices and sensor data
- [ ] Real-time updates work
- [ ] Date range selection functions

### ✅ ML Features (if configured)
- [ ] `/dashboard/predictions` shows API ready
- [ ] Can load data from Firebase
- [ ] Inference runs successfully
- [ ] Results display correctly

### ✅ Performance
- [ ] Pages load within 2 seconds
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Web Vitals in good range

---

## Performance Optimizations

Already included in the build:

### ✅ Image Optimization
- AVIF/WebP format conversion
- Responsive image sizes
- Lazy loading
- Blur placeholders

### ✅ Code Optimization
- Automatic code splitting per route
- Tree shaking for unused code
- Minification and compression
- Bundle size optimization

### ✅ Caching Strategy
```javascript
// Aggressive caching for static assets
headers: {
  'Cache-Control': 'public, max-age=31536000, immutable'
}
```

### ✅ Security Headers
- XSS Protection
- Frame Options (clickjacking prevention)
- Content Type Options
- Referrer Policy

### ✅ Bundle Analysis

Current bundle sizes (optimized):
```
Route                          Size      First Load JS
├ ○ /                         5.2 kB     102 kB
├ ○ /about                    15.3 kB    117 kB
├ ○ /ml-models                8.7 kB     111 kB
├ ○ /dashboard/database       45.2 kB    147 kB
├ ○ /dashboard/predictions    463 kB     565 kB (largest - ML libs)
└ ○ /dashboard/analytics      28.4 kB    130 kB
```

---

## Custom Domain Setup

### 1. Add Domain in Vercel
- Project Settings → **Domains**
- Click **Add Domain**
- Enter your domain name
- Click **Add**

### 2. Configure DNS

Vercel will provide DNS records. Add to your domain provider:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Wait for Propagation
- DNS changes take 24-48 hours
- Vercel auto-issues SSL certificate
- HTTPS is automatic

### 4. Update Environment Variable
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Monitoring & Analytics

### Vercel Analytics

Already integrated with `@vercel/analytics`:
- **Real-time visitor analytics**
- **Web Vitals monitoring**
- **Page performance tracking**

Access in Vercel Dashboard → **Analytics** tab

### Real User Monitoring

Key metrics tracked:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)

### Error Tracking

View errors in:
- Vercel Dashboard → **Deployments** → **Function Logs**
- Real-time logs during deployment
- Runtime logs for serverless functions

---

## Automatic Deployments

### Git Integration

Vercel automatically deploys on:

**Production Branch (`main` or `master`):**
- Automatic deployment
- Production environment variables
- Production URL updated

**Other Branches:**
- Preview deployment created
- Unique preview URL
- Same environment variables

**Pull Requests:**
- Preview deployment on every PR
- Automatic URL in PR comment
- Review changes before merge

### Deployment Notifications

Enable in Project Settings → **Git**:
- 📧 Email notifications
- 🔔 Slack integration
- 📱 GitHub checks

---

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
# Locally test build
npm run build

# Check package.json dependencies
npm install
```

**Solution:** Ensure all dependencies are in `package.json`, not `devDependencies`

### Firebase Connection Error

**Error: Firebase not connecting**

Check:
1. Environment variables are set in Vercel
2. All `NEXT_PUBLIC_*` variables are present
3. Firebase Database URL is correct
4. Firebase project is active

### Large Bundle Warning

**Warning: Bundle size exceeds 500 KB**

Solutions:
- Already optimized with dynamic imports
- ML libraries are loaded only on predictions page
- Consider lazy loading additional features

### Vertex AI Authentication Error

**Error: Permission denied**

Check:
1. `GOOGLE_SERVICE_ACCOUNT_KEY` is properly formatted JSON
2. Service account has **Vertex AI User** role
3. Endpoint ID is correct
4. Project ID matches service account

### Environment Variables Not Working

**Variables undefined in production**

Solutions:
1. Ensure variables are set for **Production** environment
2. Redeploy **without** build cache
3. Check variable names are exact (case-sensitive)
4. Client-side variables must start with `NEXT_PUBLIC_`

---

## Production Checklist

Before launching to production:

### Security
- [ ] Firebase Security Rules configured
- [ ] Service account key stored securely in Vercel
- [ ] No sensitive data in client code
- [ ] HTTPS enforced (automatic with Vercel)

### Performance
- [ ] Lighthouse score > 90
- [ ] All images optimized
- [ ] No console warnings
- [ ] Bundle size optimized

### Functionality
- [ ] All pages accessible
- [ ] Database reads/writes work
- [ ] ML predictions functional
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking setup
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

---

## Rollback

If deployment has issues:

### Via Vercel Dashboard
1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

### Via CLI
```bash
vercel rollback
```

---

## Cost Optimization

### Vercel Free Tier Includes:
- ✅ 100 GB bandwidth
- ✅ 6,000 build minutes
- ✅ Automatic HTTPS
- ✅ CDN (Edge Network)
- ✅ Analytics

### To Stay Within Free Tier:
- Optimize images (already done)
- Use caching effectively (configured)
- Monitor bandwidth usage
- Limit preview deployments if needed

### Vertex AI Costs:
- Pay per prediction request
- ~$0.00004 per prediction
- Monitor usage in GCP Console
- Set up billing alerts

---

## Support & Resources

### Vercel Documentation
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

### Firebase Resources
- [Security Rules](https://firebase.google.com/docs/database/security)
- [Database Indexing](https://firebase.google.com/docs/database/security/indexing-data)

### Google Cloud
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

---

**Last Updated:** October 2025

**Next Steps:** After successful deployment, see [MONITORING.md](./MONITORING.md) for ongoing maintenance
