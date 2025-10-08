# Firestore Security Rules Setup

## 🚨 CRITICAL: Required for Favorites to Work

**Symptoms:**
- ✅ Movies appear in favorites when you add them
- ❌ After refreshing the page, favorites disappear
- ❌ Console shows "permission-denied" errors
- ❌ Toast notification: "Permission denied. Firestore rules not configured!"

**Root Cause:** Firestore security rules are missing. By default, Firestore blocks all operations for security.

---

## 📋 Step-by-Step Solution

### Step 1: Open Firebase Console
1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. **Select your project** from the project list
3. In the left sidebar, click **Firestore Database**
4. If Firestore is not enabled, click "Create Database" and choose a location
5. Click the **Rules** tab at the top

### Step 2: Add Security Rules
**Copy and paste** the following rules into the editor:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own favorites
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: Publish the Rules
1. Click the **Publish** button (top right)
2. Wait for deployment (usually 5-10 seconds)
3. You should see "Rules published successfully"

### Step 4: Verify It Works
1. **Refresh your application** in the browser
2. **Check the console** - you should see:
   - ✅ "Firestore connection test: SUCCESS"
   - ✅ No permission-denied errors
3. **Add a movie to favorites**
4. **Refresh the page** - favorites should now persist!

---

## 🔍 What These Rules Do

| Rule Part | What It Does |
|-----------|--------------|
| `request.auth != null` | Only logged-in users can access favorites |
| `request.auth.uid == userId` | Users can ONLY access their own favorites (not other users' data) |
| `allow read, write` | Users can both read and write their favorites |

This ensures:
- ✅ **Security**: No unauthorized access to user data
- ✅ **Privacy**: Each user's favorites are isolated
- ✅ **Functionality**: Favorites persist across page refreshes

---

## 🐛 Troubleshooting

### Issue 1: Still seeing "permission-denied" errors
**Solutions:**
- Make sure you clicked "Publish" after adding the rules
- Wait 10-15 seconds for rules to propagate
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check that the rules were saved correctly in Firebase Console

### Issue 2: Console shows "Firestore connection test: FAILED"
**Solutions:**
- Verify Firestore is enabled in Firebase Console
- Check internet connection
- Make sure Firebase project ID in `.env` file is correct
- Verify all Firebase environment variables are set

### Issue 3: "User not logged in" errors
**Solutions:**
- Make sure you're logged in to the application
- Check that Firebase Authentication is enabled
- Verify auth state is properly initialized

### Issue 4: Rules editor shows syntax errors
**Solutions:**
- Make sure you copied the ENTIRE rules block including `rules_version`
- Check for any extra characters or missing brackets
- Use the exact formatting shown above

---

## 📊 How to Verify Rules Are Active

### Method 1: Browser Console
Open browser DevTools (F12) and look for:
```
✅ Firestore connection test: SUCCESS
✅ Loaded X favorites from Firestore
```

### Method 2: Firebase Console
1. Go to Firebase Console → Firestore Database → Rules
2. Rules should show "Last updated: [recent time]"
3. Rules should match the format shown above

### Method 3: Test the App
1. Add a movie to favorites
2. Look for toast notification: "Added [movie] to favorites!"
3. Refresh the page
4. Movie should still be in favorites

---

## 🔗 Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- Check browser console for detailed error messages

---

## ⚡ Quick Reference

**Required Rules (copy-paste):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Firebase Console Path:**  
Firebase Console → Select Project → Firestore Database → Rules → Paste → Publish

**Expected Console Output:**
```
✅ Firebase initialized successfully
✅ Firestore connection test: SUCCESS
✅ Loaded X favorites from Firestore
```
