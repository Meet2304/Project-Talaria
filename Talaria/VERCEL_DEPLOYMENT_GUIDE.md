# Vercel Deployment Guide for Talaria

## Quick Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Firebase project with Realtime Database configured
- Git repository connected

### Step 1: Deploy to Vercel

1. **Via Vercel Dashboard:**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Select the `Talaria` folder as the root directory
   - Click "Deploy"

2. **Via Vercel CLI:**
   ```bash
   npm i -g vercel
   cd Talaria
   vercel
   ```

### Step 2: Configure Environment Variables

In the Vercel Dashboard, go to **Project Settings > Environment Variables** and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Copy these values from your `.env.local` file or Firebase Console.

### Step 3: Redeploy

After adding environment variables, trigger a new deployment:
- Click "Deployments" tab
- Click "Redeploy" on the latest deployment
- Select "Use existing Build Cache" = **NO**

### Step 4: Verify Deployment

1. Visit your deployment URL
2. Check the database connection on `/dashboard/database`
3. Verify all pages load correctly
4. Test ML predictions on `/dashboard/predictions`

## Performance Optimizations Included

✅ **Image Optimization:** AVIF/WebP formats with optimized sizes
✅ **Code Splitting:** Automatic route-based code splitting
✅ **Console Removal:** Production console.log statements removed
✅ **Compression:** Gzip/Brotli compression enabled
✅ **Caching:** Aggressive caching for static assets
✅ **Security Headers:** XSS, clickjacking, and content-type protection
✅ **Bundle Optimization:** Optimized package imports for smaller bundles

## Build Configuration

- **Framework:** Next.js 15.5.4
- **Node Version:** 18.x or higher (auto-detected by Vercel)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Monitoring

### Vercel Analytics
The app includes `@vercel/analytics` for:
- Real-time visitor analytics
- Web Vitals monitoring (LCP, FID, CLS)
- Page performance tracking

View analytics in Vercel Dashboard under "Analytics" tab.

### Errors & Logs
- View real-time logs: Vercel Dashboard > Deployments > View Function Logs
- Runtime logs show in the "Functions" tab

## Troubleshooting

### Build Fails
1. Check build logs in Vercel Dashboard
2. Verify all dependencies in package.json
3. Ensure environment variables are set
4. Try local build: `npm run build`

### Firebase Connection Issues
1. Verify all Firebase environment variables are set
2. Check Firebase Security Rules allow read access
3. Ensure Database URL uses correct region

### Large Bundle Size
- Current bundle is optimized with code splitting
- Main bundle: ~102 KB (shared)
- Largest page: ~463 KB (predictions with ML models)
- Consider lazy loading for ML models if needed

## Custom Domain

1. Go to Vercel Dashboard > Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Update `SITE_URL` environment variable

## Automatic Deployments

- **Production:** Deploys automatically on push to `main` branch
- **Preview:** Creates preview deployment for pull requests
- **Development:** Use `vercel dev` for local development with Vercel features

## Security Considerations

- ✅ All Firebase keys are public (NEXT_PUBLIC_*) - this is safe
- ✅ Actual data security is handled by Firebase Security Rules
- ✅ Security headers prevent XSS and clickjacking
- ✅ No sensitive keys should be in client-side code

## Performance Targets

Current Lighthouse scores (target):
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review Firebase console for database issues
3. Check browser console for client-side errors
4. Verify environment variables are correctly set

---

**Last Updated:** October 2025
**Version:** 1.0.0
