# 🚀 **Shadow Files Netlify Deployment Guide**

## **Complete Step-by-Step Deployment**

### 📋 **What We're Deploying:**
- **Frontend:** React app on Netlify
- **Backend:** FastAPI on Railway 
- **Database:** MongoDB Atlas (free)
- **Payments:** Real PayPal integration
- **Cost:** FREE (with free tiers)

---

## **STEP 1: Set Up Database (MongoDB Atlas)**

### **1.1 Create MongoDB Atlas Account:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Sign up** for free account
3. **Create a new project:** "Shadow Files"

### **1.2 Create Database Cluster:**
1. **Click "Build a Database"**
2. **Choose:** M0 Sandbox (FREE)
3. **Cloud Provider:** AWS
4. **Region:** us-east-1
5. **Cluster Name:** `shadow-files-cluster`
6. **Create Cluster** (takes 3-5 minutes)

### **1.3 Set Up Database Access:**
1. **Database Access → Add New User:**
   - **Username:** `shadowfiles`
   - **Password:** `ShadowFiles2025!`
   - **Role:** Atlas Admin
2. **Network Access → Add IP Address:**
   - **Click "Allow Access from Anywhere"** (0.0.0.0/0)
3. **Get Connection String:**
   - **Connect → Connect your application**
   - **Copy connection string:** `mongodb+srv://shadowfiles:ShadowFiles2025!@shadow-files-cluster.xxxxx.mongodb.net/shadow_files`

---

## **STEP 2: Deploy Backend (Railway)**

### **2.1 Create Railway Account:**
1. Go to [railway.app](https://railway.app)
2. **Sign up** with GitHub account
3. **Connect your GitHub** repository

### **2.2 Create New Project:**
1. **Dashboard → New Project**
2. **Deploy from GitHub repo**
3. **Select your Shadow Files repository**
4. **Choose root directory**

### **2.3 Configure Environment Variables:**
1. **Go to your project → Variables tab**
2. **Add these variables:**
```
MONGO_URL=mongodb+srv://shadowfiles:ShadowFiles2025!@shadow-files-cluster.xxxxx.mongodb.net/shadow_files
DB_NAME=shadow_files
PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
PAYPAL_CLIENT_SECRET=EFa3uTWSzcIvEiT2mxi-GvNj4EFZDcONhoF4h4JXCzidOKyCv1PfHfN3ocYS5Qn1nhxUOpmxHxEhRjMO
CORS_ORIGINS=https://shadowfiles.netlify.app
PORT=8000
```

### **2.4 Configure Build:**
1. **Settings → Build**
2. **Root Directory:** `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

### **2.5 Deploy:**
1. **Click Deploy**
2. **Wait for build** (3-5 minutes)
3. **Copy your Railway URL:** `https://shadow-files-backend-production-xxxx.up.railway.app`

---

## **STEP 3: Deploy Frontend (Netlify)**

### **3.1 Create Netlify Account:**
1. Go to [netlify.com](https://www.netlify.com)
2. **Sign up** with GitHub account
3. **Connect your GitHub**

### **3.2 Deploy from Git:**
1. **Sites → Add new site → Import from Git**
2. **Choose GitHub**
3. **Select your Shadow Files repository**
4. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `yarn build`
   - **Publish directory:** `frontend/build`

### **3.3 Set Environment Variables:**
1. **Site settings → Environment variables**
2. **Add variables:**
```
REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
REACT_APP_PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
```

### **3.4 Deploy:**
1. **Click "Deploy site"**
2. **Wait for build** (2-3 minutes)
3. **Your site is live!** at `https://amazing-name-123456.netlify.app`

### **3.5 Custom Domain (Optional):**
1. **Site settings → Domain management**
2. **Add custom domain:** `shadowfiles.com`
3. **Follow DNS setup instructions**

---

## **🎯 ALTERNATIVE: One-Click Deploy**

### **Deploy to Netlify Button:**
I can create a one-click deploy button for you:

```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/shadow-files)
```

### **Deploy to Railway Button:**
```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/shadow-files-backend)
```

---

## **STEP 4: Configure CORS (Important!)**

### **Update Backend CORS Settings:**
1. **In your Railway backend environment variables**
2. **Update CORS_ORIGINS:** `https://your-netlify-url.netlify.app`
3. **Redeploy backend**

---

## **STEP 5: Test Everything**

### **🔍 Testing Checklist:**
- [ ] **Frontend loads:** Visit your Netlify URL
- [ ] **Backend API works:** Check `https://your-railway-url.up.railway.app/api`
- [ ] **Database connected:** Game saves work
- [ ] **PayPal integration:** Try purchasing an item
- [ ] **X social links:** Click @ShadowFilesGame links
- [ ] **All themes work:** Switch between skins
- [ ] **Secrets unlock:** Spend evidence on conspiracies

---

## **💰 Pricing Breakdown**

### **Free Tier Limits:**
- **Netlify:** 100GB bandwidth, 300 build minutes/month
- **Railway:** 500 hours runtime, $5 credit/month
- **MongoDB Atlas:** 512MB storage, shared clusters
- **Total Cost:** **$0/month** (within free limits)

### **Paid Upgrade Costs:**
- **Netlify Pro:** $19/month (more bandwidth)
- **Railway:** $5/month (more runtime)
- **MongoDB Atlas:** $9/month (dedicated cluster)
- **Total:** ~$33/month for full paid tiers

---

## **🔧 Configuration Files Created**

I've prepared these files for easy deployment:

- **`netlify.toml`** - Netlify build configuration
- **`railway.toml`** - Railway deployment settings  
- **`Procfile`** - Heroku/Railway process file
- **`requirements-deploy.txt`** - Minimal backend requirements

---

## **🛠️ Troubleshooting**

### **Common Issues:**

**❌ "Backend not responding"**
```bash
# Check Railway logs
# Go to Railway dashboard → Your project → Deployments → View logs
```

**❌ "CORS error"**
```bash
# Update CORS_ORIGINS in Railway environment variables
# Must match your Netlify URL exactly
```

**❌ "Database connection failed"**
```bash
# Check MongoDB Atlas connection string
# Ensure IP whitelist includes 0.0.0.0/0
# Verify username/password in connection string
```

**❌ "PayPal not working"**
```bash
# Verify PAYPAL_CLIENT_ID in both frontend and backend
# Check browser console for PayPal script errors
```

---

## **🚀 Advanced Features**

### **Custom Domain Setup:**
1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **Add to Netlify:** Site settings → Domain management
3. **Update DNS** records as instructed
4. **SSL certificate** auto-generated by Netlify

### **CI/CD Setup:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## **📊 Performance Optimization**

### **Netlify Optimizations:**
- **Enable asset optimization**
- **Enable form detection** 
- **Set up analytics**
- **Configure edge functions** (advanced)

### **Railway Optimizations:**
- **Enable auto-sleep** for free tier
- **Set up health checks**
- **Configure auto-scaling** (paid)

---

## **🎉 Success! Your Game is Live**

After following this guide, you'll have:

✅ **Shadow Files running on Netlify** (frontend)  
✅ **FastAPI backend on Railway** with real PayPal  
✅ **MongoDB Atlas database** storing game data  
✅ **Custom domain** (optional)  
✅ **SSL certificate** (automatic)  
✅ **Global CDN** via Netlify  
✅ **Professional deployment** ready for users  

**Total setup time: 15-20 minutes**  
**Monthly cost: FREE** (with free tiers)

---

## **📞 Support**

**Need help?**
- **Netlify issues:** Check Netlify support docs
- **Railway issues:** Check Railway documentation  
- **MongoDB issues:** Check Atlas documentation
- **PayPal issues:** Verify API credentials

**Common URLs for debugging:**
- **Frontend:** `https://your-site.netlify.app`
- **Backend Health:** `https://your-app.up.railway.app/api/health`
- **API Docs:** `https://your-app.up.railway.app/docs`