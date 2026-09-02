# 🚀 Hostinger Node.js Deployment & Setup Guide (Complete Urdu & English)

This guide walks you through deploying and starting the **Ecom With Sami** full-stack Node.js + Express + React LMS application on Hostinger.

---

## 🌟 Advantages of Node.js on Hostinger

* **Zero PHP Conflicts:** No FastCGI header dropping, no `.htaccess` rewrite issues.
* **Unified Single Process:** Runs Frontend (React SSR), Backend (29 APIs), SQLite Database, and Anti-Piracy DRM Security together under one port.
* **Instant Dynamic Sync:** Real-time synchronization between Admin Panel and Student LMS.

---

## 🛠️ Step-by-Step Deployment on Hostinger

### Step 1: Push / Upload Code to Hostinger
You can deploy using either **Git Repository** (Recommended) or **File Manager Upload**:

#### Option A: Via Hostinger Git Deployment (Fastest & Auto-Updates)
1. In Hostinger hPanel, go to **Advanced ➔ Git**.
2. Paste repository URL: `https://github.com/msaadfall25bsse/Ecom-with-sami-project.git`
3. Branch: `main`
4. Click **Create / Deploy**.

#### Option B: Via File Manager
1. Upload all project files into your application root folder (e.g. `public_html` or `/domains/ecomwithsami.com/app`).

---

### Step 2: Configure Hostinger Node.js Application Manager

1. In Hostinger hPanel, search and click on **Node.js** (or **Node.js Web App**).
2. Click **Create Application** and configure:
   * **Node.js Version:** `20.x` or `22.x`
   * **Application Mode:** `Production`
   * **Application Root:** `/` (or your app directory)
   * **Application Startup File:** `server.js` (or `server/index.ts`)
   * **Port:** Default (e.g., `5000` or auto-assigned by Hostinger)

---

### Step 3: Install Dependencies & Build Frontend

Open the **Hostinger SSH / Terminal** (or use the npm command box in hPanel) and run:

```bash
# 1. Install all dependencies
npm install

# 2. Build production React + Vike SSR bundle
npm run build

# 3. Start the production server
npm start
```

---

### Step 4: Verify Live System

1. **Storefront:** Visit `https://ecomwithsami.com/` (Clean luxury design, 1-click checkout)
2. **Student Login & LMS:** Visit `https://ecomwithsami.com/login` ➔ Access `/lms`
3. **Admin Panel:** Visit `https://ecomwithsami.com/admin/login` ➔ Access `/admin`
   * **Default Admin Email:** `sami@ecomwithsami.com`
   * **Default Admin Password:** `SamiMaster@2026`

---

## 🛡️ Anti-Piracy DRM Security Verified
* Right-click inspection disabled.
* Keystroke interceptor for `PrintScreen`, `Win+Shift+S`, Mac shortcuts.
* Visual blackout shield on capture attempts.
* Moving dynamic watermark with Student Name, Email, IP, and live clock.
* 3-Strike policy with automatic suspension and 1-click Admin unlock from `/admin/banned-students`.
