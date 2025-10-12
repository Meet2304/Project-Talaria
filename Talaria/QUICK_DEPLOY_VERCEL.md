# 🚀 Quick Deploy to Vercel - Cheat Sheet

## ⚡ 3-Step Deployment

### Step 1: Deploy
```bash
# Via CLI
npm i -g vercel
cd Talaria
vercel --prod

# Or use Vercel Dashboard:
# https://vercel.com/new
```

### Step 2: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Copy from `.env.local` file.

### Step 3: Redeploy
Trigger redeploy after adding environment variables.

---

## ✅ Pre-Flight Checklist

- [x] Build succeeds: `npm run build`
- [x] No ESLint errors
- [x] Environment variables ready
- [x] Firebase project active

---

## 🔍 Verify Deployment

1. Visit your deployment URL
2. Check `/dashboard/database` for connection
3. Test ML predictions on `/dashboard/predictions`
4. Verify all routes load

---

## 📊 Build Results

✓ Zero errors  
✓ Zero warnings  
✓ Bundle: 102 KB shared  
✓ Largest page: 463 KB (predictions)

---

## 🆘 Quick Fixes

**Build fails?**
```bash
npm run build
```

**Env vars not working?**
- Use `NEXT_PUBLIC_` prefix
- Redeploy without cache

**Firebase not connecting?**
- Check database URL format
- Verify all env vars set

---

## 📚 Full Documentation

- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete guide
- `VERCEL_CHECKLIST.md` - Detailed checklist
- `OPTIMIZATION_SUMMARY.md` - All changes
- `.env.example` - Environment template

---

**Status:** ✅ Ready for Production  
**Last Updated:** October 12, 2025
