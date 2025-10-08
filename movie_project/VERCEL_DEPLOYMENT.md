# Vercel Deployment Guide - Cine-match

## 🚀 Deploy Your Movie Project to Vercel

This guide will walk you through deploying your Cine-match project to Vercel with all the necessary configuration.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with repository: `priyanshjhaa/Cine-match`
- ✅ Code pushed to GitHub (completed ✓)
- ✅ Firestore security rules configured (completed ✓)
- ✅ All environment variables ready (listed below)

---

## 🎯 Step-by-Step Deployment

### Step 1: Create Vercel Account

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Sign in with your GitHub account: **priyanshjhaa**
4. Authorize Vercel to access your repositories
5. Complete the account setup

---

### Step 2: Import Your Project

1. Once logged in, click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"Cine-match"** in the list
5. Click **"Import"** next to it

---

### Step 3: Configure Build Settings

Vercel should auto-detect your project settings. Verify these are correct:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | ./ (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

✅ If these are auto-filled correctly, don't change them!

---

### Step 4: Add Environment Variables (CRITICAL!)

⚠️ **IMPORTANT:** Your app will NOT work without these environment variables!

Click on **"Environment Variables"** section (before deploying).

Add these **8 variables** one by one:

#### Variable 1: TMDB API Key
- **Name:** `VITE_TMDB_API_KEY`
- **Value:** `7568a46b7fc886615f211c15a97b1e28`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 2: Firebase API Key
- **Name:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyC3bcQY2Jej9VODRWPUSm1zXc9E2HqYAa4`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 3: Firebase Auth Domain
- **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `cinematch-a35e2.firebaseapp.com`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 4: Firebase Project ID
- **Name:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `cinematch-a35e2`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 5: Firebase Storage Bucket
- **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `cinematch-a35e2.firebasestorage.app`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 6: Firebase Messaging Sender ID
- **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `200298491144`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 7: Firebase App ID
- **Name:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:200298491144:web:2892be81e483370d9710bd`
- **Environments:** ✓ Production ✓ Preview ✓ Development

#### Variable 8: Firebase Measurement ID
- **Name:** `VITE_FIREBASE_MEASUREMENT_ID`
- **Value:** `G-SMQ7L1PZZF`
- **Environments:** ✓ Production ✓ Preview ✓ Development

---

### How to Add Each Variable in Vercel:

For each variable above:

1. In the **"Environment Variables"** section
2. **Key** field: Enter the variable name (e.g., `VITE_TMDB_API_KEY`)
3. **Value** field: Enter the value (e.g., `7568a46b7fc886615f211c15a97b1e28`)
4. Check all 3 checkboxes: **Production**, **Preview**, **Development**
5. Click **"Add"**
6. Repeat for all 8 variables

⚠️ **Important Notes:**
- Don't add quotes around values
- Keep the `VITE_` prefix in variable names
- Make sure all 3 environments are selected for each variable

---

### Step 5: Deploy! 🚀

1. After adding all environment variables, scroll down
2. Click the big **"Deploy"** button
3. Wait 1-3 minutes for the build to complete
4. Watch the build logs (optional - you can see what's happening)
5. ✅ Success! You'll see a **"Congratulations"** message

Your site will be live at: **`https://cine-match-[random-id].vercel.app`**

---

### Step 6: Configure Firebase Authorized Domains (CRITICAL!)

Your authentication won't work until you do this:

1. Copy your Vercel URL (e.g., `cine-match-xyz123.vercel.app`)
2. Go to **Firebase Console:** https://console.firebase.google.com/
3. Select your project: **cinematch-a35e2**
4. Click **Authentication** in left sidebar
5. Go to **Settings** tab → **Authorized domains**
6. Click **"Add domain"**
7. Paste your Vercel domain: `cine-match-xyz123.vercel.app`
   - ⚠️ Don't include `https://`, just the domain
8. Click **"Add"**

✅ Now authentication will work on your live site!

---

### Step 7: Test Your Live Site

Visit your Vercel URL and test:

1. ✅ **Homepage loads** - You should see movies
2. ✅ **Sign up** - Create a new account
3. ✅ **Login** - Sign in with your account
4. ✅ **Add favorites** - Add a movie to favorites
5. ✅ **Refresh page** - Favorites should persist
6. ✅ **Profile page** - Check your profile

If all these work, **you're live!** 🎉

---

## 🔄 Automatic Deployments

**Good news:** Every time you push code to GitHub, Vercel automatically deploys!

### How it works:
1. Make changes locally
2. Commit: `git commit -m "Update feature"`
3. Push: `git push`
4. Vercel automatically builds and deploys (1-2 minutes)

### To see deployments:
- Go to Vercel Dashboard → Your Project → Deployments tab

---

## 🌐 Custom Domain (Optional)

Want a custom domain like `cinematch.com` instead of `cine-match-xyz.vercel.app`?

### Steps:
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel Project → **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter your domain: `cinematch.com`
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5 minutes - 48 hours)

### Remember:
- Also add custom domain to Firebase Authorized Domains
- Vercel provides free SSL certificates automatically

---

## 🐛 Troubleshooting

### Issue 1: Build Failed

**Symptoms:** Red error message, build stops

**Solutions:**
- Check build logs for specific error
- Verify all environment variables are added
- Make sure build works locally: `npm run build`
- Check that all dependencies are in `package.json`

### Issue 2: Blank Page / White Screen

**Symptoms:** Site loads but shows nothing

**Solutions:**
- Check browser console for errors (F12)
- Verify environment variables are set correctly
- Check that base path in `vite.config.js` is correct
- Look at Vercel function logs for errors

### Issue 3: Authentication Not Working

**Symptoms:** Can't login, "auth/operation-not-allowed" error

**Solutions:**
- ✅ Add Vercel domain to Firebase Authorized Domains
- ✅ Verify all Firebase env variables are correct
- ✅ Check Firebase Console → Authentication is enabled
- ✅ Email/Password provider is enabled in Firebase

### Issue 4: Favorites Not Persisting

**Symptoms:** Favorites disappear on refresh

**Solutions:**
- ✅ Check Firestore security rules are published
- ✅ Open browser console, look for Firestore errors
- ✅ Verify Firestore connection test shows "SUCCESS"
- ✅ See `FIRESTORE_SETUP.md` for detailed guide

### Issue 5: 404 on Routes

**Symptoms:** Direct URL like `/favorites` shows 404

**Solutions:**
- Vercel should auto-configure for SPA routing
- If not working, create `vercel.json` with rewrites (see below)

### Issue 6: Movies Not Loading

**Symptoms:** No movies show on homepage

**Solutions:**
- ✅ Check TMDB API key is correct
- ✅ Verify `VITE_TMDB_API_KEY` environment variable
- ✅ Check browser console for API errors
- ✅ Verify TMDB API is not rate-limited

---

## 📝 Advanced Configuration

### Add vercel.json (if needed)

If you encounter routing issues, create this file in project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures all routes work correctly (SPA routing).

---

## 🔐 Security Best Practices

### Environment Variables:
- ✅ Never commit `.env` files to GitHub
- ✅ Rotate API keys periodically
- ✅ Use different Firebase projects for dev/prod (optional)

### Firebase:
- ✅ Keep Firestore security rules restrictive
- ✅ Only add trusted domains to Authorized Domains
- ✅ Monitor Firebase usage in console

---

## 📊 Vercel Dashboard Overview

### Key Sections:

1. **Overview** - Quick stats and recent deployments
2. **Deployments** - Full deployment history
3. **Settings** - Environment variables, domains, general settings
4. **Analytics** - Traffic and performance (Pro plan)
5. **Logs** - Function logs for debugging

---

## ✅ Deployment Checklist

Before marking deployment complete, verify:

- [ ] Site loads at Vercel URL
- [ ] All 8 environment variables added
- [ ] Firebase authorized domain configured
- [ ] Sign up works
- [ ] Login works
- [ ] Favorites persist after refresh
- [ ] All pages accessible (home, favorites, profile)
- [ ] No console errors
- [ ] Mobile responsive (test on phone)
- [ ] Fast load times

---

## 🎉 You're Live!

**Congratulations!** Your Cine-match project is now live on Vercel!

**Your live site:** Check Vercel dashboard for URL

**Share your project:**
- Add the URL to your GitHub README
- Share on social media
- Add to your portfolio

---

## 📚 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Documentation:** https://vercel.com/docs
- **Your GitHub Repo:** https://github.com/priyanshjhaa/Cine-match
- **Firebase Console:** https://console.firebase.google.com/project/cinematch-a35e2
- **Support:** Create issue on GitHub or contact Vercel support

---

## 🚀 Next Steps

Now that you're live, consider:

1. **Add custom domain** for professional look
2. **Set up analytics** to track visitors
3. **Add more features** and push to GitHub (auto-deploys!)
4. **Optimize performance** using Vercel Analytics
5. **Share your project** with friends and recruiters

---

**Happy Hosting! 🎬✨**
