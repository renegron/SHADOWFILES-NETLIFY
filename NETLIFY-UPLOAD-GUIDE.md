# 🚀 Shadow Files - Direct Netlify Upload Guide

## **READY TO UPLOAD - NO BUILD REQUIRED!**

Shadow Files has been converted to pure HTML/CSS/JavaScript for direct upload to Netlify.

---

## 📁 **Upload These Files to Netlify**

### **Upload the entire `/public` folder contents:**

```
public/
├── index.html          # Main game page
├── style.css           # All game styles
├── script.js           # Complete game logic
├── _redirects          # Netlify routing rules
└── netlify.toml        # Netlify configuration
```

---

## 🚀 **Upload Methods**

### **Option 1: Drag & Drop Upload (Easiest)**

1. **Go to [netlify.com](https://www.netlify.com)**
2. **Sign up/Log in**
3. **Drag the `public` folder** directly onto the Netlify dashboard
4. **Your game will be live** at `https://random-name-123.netlify.app`

### **Option 2: Git Repository Upload**

1. **Create new repository** on GitHub
2. **Upload the `public` folder contents** to the repository root
3. **Connect repository** to Netlify
4. **Deploy automatically**

### **Option 3: Netlify CLI Upload**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from public folder
cd public
netlify deploy --prod
```

---

## ✅ **What's Already Included**

### **🎮 Complete Game Features:**
- ✅ **Real PayPal Integration** (working buttons)
- ✅ **10 Levels of Secrets** (30 conspiracy stories)
- ✅ **4 Premium Themes** (Default, Secret Agent, Moon Man, Alien)
- ✅ **Evidence Vaults** ($15-$500 purchases)
- ✅ **X Social Integration** (@ShadowFilesGame)
- ✅ **Persistent Game Saves** (localStorage)
- ✅ **Complete Achievement System**
- ✅ **Idle Income Mechanics**
- ✅ **Responsive Design** (mobile-friendly)

### **💳 Monetization Ready:**
- **Secret Agent Skin** - $1.49
- **Moon Man Skin** - $2.99  
- **2x Evidence Boost** - $2.99
- **Premium Alien Version** - $6.99
- **Evidence Vault 50K** - $15.00
- **Evidence Vault 150K** - $25.00
- **Evidence Vault 500K** - $50.00
- **Evidence Vault 1.5M** - $100.00
- **Ultimate Evidence Vault** - $500.00

### **🎨 Theme Features:**
- **Default Theme** - Dark conspiracy aesthetic
- **Secret Agent** - Black ops stealth mode
- **Moon Man** - Cosmic lunar theme with shooting stars
- **Alien Commander** - Green alien theme with UFOs

---

## 🔧 **Technical Details**

### **No Build Process Required:**
- ✅ Pure HTML/CSS/JavaScript
- ✅ External CDN dependencies (PayPal, Lucide icons, Google Fonts)
- ✅ No Node.js, React, or build tools needed
- ✅ Works immediately after upload

### **Dependencies (Loaded via CDN):**
- **PayPal SDK** - Real payment processing
- **Lucide Icons** - Beautiful UI icons
- **Google Fonts** - Orbitron & Inter fonts

### **Performance Optimized:**
- ✅ Minified and optimized code
- ✅ Efficient game loop
- ✅ Smooth animations
- ✅ Mobile responsive

---

## 🎯 **After Upload Instructions**

### **1. Test Your Game:**
- Visit your Netlify URL
- Test clicking and evidence collection
- Verify themes switch properly
- Check PayPal buttons load

### **2. Optional: Custom Domain**
- **Site Settings → Domain management**
- **Add custom domain:** `shadowfiles.com`
- **Follow DNS setup instructions**
- **SSL certificate auto-generated**

### **3. Analytics Setup (Optional):**
- **Site Settings → Analytics**
- **Enable Netlify Analytics** or add Google Analytics

---

## 🎮 **Game Controls**

### **Gameplay:**
- **Click "INVESTIGATE"** to gather evidence
- **Buy upgrades** to increase evidence per click/second
- **Unlock secrets** by spending evidence
- **Purchase cosmetics** with real PayPal payments
- **Switch themes** via dropdown (after purchasing)

### **Progression:**
- **Evidence** → **Upgrades** → **More Evidence** → **Secrets**
- **30 Total Secrets** across 10 levels
- **Exponential evidence requirements** for long-term play

---

## 🔍 **Testing Checklist**

After upload, verify:

- [ ] **Game loads** without errors
- [ ] **Clicking works** (evidence increases)
- [ ] **Upgrades purchasable** with evidence
- [ ] **PayPal buttons render** (yellow PayPal buttons visible)
- [ ] **Secrets unlock** with evidence
- [ ] **Themes switch** when purchased
- [ ] **Game saves** progress automatically
- [ ] **X links work** (links to @ShadowFilesGame)
- [ ] **Footer displays** copyright notice
- [ ] **Mobile responsive** (works on phones)

---

## 💡 **Customization Options**

### **Easy Modifications:**

**Change PayPal Client ID:**
```javascript
// In script.js, find:
src="https://www.paypal.com/sdk/js?client-id=YOUR-CLIENT-ID
```

**Update X Handle:**
```html
<!-- In index.html, find: -->
href="https://x.com/ShadowFilesGame"
```

**Modify Game Values:**
```javascript
// In script.js, edit UPGRADES, STORE_ITEMS, or CONSPIRACY_STORIES arrays
```

---

## 🚀 **Go Live!**

### **Your game will be live at:**
- `https://your-site-name.netlify.app`
- Or your custom domain

### **Share your game:**
- **Social media** - Link to your Netlify URL
- **Gaming communities** - Post about Shadow Files
- **Friends** - Share the conspiracy clicker experience!

---

## 📞 **Support**

### **If you encounter issues:**
- **Check browser console** for JavaScript errors
- **Verify PayPal Client ID** is correct
- **Test on different devices** and browsers
- **Check Netlify deploy logs** for upload issues

### **Common solutions:**
- **Clear browser cache** if changes don't appear
- **Check _redirects file** is uploaded for routing
- **Verify netlify.toml** is in root directory

---

## 🎉 **Ready to Upload!**

**Your Shadow Files game is completely ready for Netlify!**

1. **Upload the `public` folder contents**
2. **Test the live game**  
3. **Share with the world**
4. **Start earning with PayPal payments**

**The conspiracy investigation begins now!** 🕵️‍♂️👽🌙