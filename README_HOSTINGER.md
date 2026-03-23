# 🚀 Hostinger Deployment Guide for DriveCost

If you are seeing "Unsupported framework" or "Invalid project structure" on Hostinger, it means you are likely using an automated "Import" or "Website Builder" tool. **Do not use those tools.**

Follow these manual steps instead:

---

## 🛠️ Option 1: Shared Hosting (Most Common)
Use this if you have a standard Hostinger Shared or Cloud hosting plan.

1.  **Build your app locally:**
    *   Export this project as a ZIP from AI Studio.
    *   Extract the ZIP and run `npm install` and then `npm run build` on your computer.
2.  **Upload the `dist` folder:**
    *   Log in to your **Hostinger hPanel**.
    *   Go to **File Manager** -> `public_html`.
    *   Upload **only the contents** of the `dist` folder into `public_html`.
    *   Make sure the `.htaccess` file is also in `public_html`.
3.  **Upload Config:**
    *   Upload `firebase-applet-config.json` to `public_html`.

---

## 🛠️ Option 2: Node.js Hosting (VPS)
Use this if you specifically have a Node.js hosting plan.

1.  **Upload the entire project:**
    *   Upload all files (except `node_modules`) to your server.
2.  **Configure hPanel:**
    *   Set **Application Entry Point** to `app.js`.
    *   Set **Application Directory** to your project folder.
    *   Set **Environment Variable** `NODE_ENV` to `production`.
3.  **Install & Build:**
    *   Connect via SSH.
    *   Run `npm install` and `npm run build`.
4.  **Start:**
    *   Start the app from the Hostinger dashboard.

---

## ⚠️ Important Tips:
*   **Do NOT use "Hostinger Website Builder"**: It only works for their own templates.
*   **Do NOT use "Import Website"**: It is designed for WordPress or Joomla.
*   **Use "File Manager"**: This is the only way to upload custom React/Vite apps.

---

## 🔑 Fix: Firebase "auth/unauthorized-domain" Error
If you see this error when logging in, you must add your Hostinger domain to the Firebase Console:

1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: **drivecost-155fe**.
3.  In the left menu, go to **Authentication** -> **Settings** -> **Authorized domains**.
4.  Click **Add domain** and enter your Hostinger domain (e.g., `yourdomain.com`).
5.  Also add these domains to ensure the AI Studio preview works:
    *   `ais-dev-klhzwvrabbojgpqnsqsshm-414456434743.asia-southeast1.run.app`
    *   `ais-pre-klhzwvrabbojgpqnsqsshm-414456434743.asia-southeast1.run.app`
    *   `localhost`

---

## 🔑 Fix: Firebase "auth/unauthorized-domain" Error
If you see this error when logging in, you must add your Hostinger domain to the Firebase Console:

1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project: **drivecost-155fe**.
3.  In the left menu, go to **Authentication** -> **Settings** -> **Authorized domains**.
4.  Click **Add domain** and enter your Hostinger domain (e.g., `yourdomain.com`).
5.  Also add these domains to ensure the AI Studio preview works:
    *   `ais-dev-klhzwvrabbojgpqnsqsshm-414456434743.asia-southeast1.run.app`
    *   `ais-pre-klhzwvrabbojgpqnsqsshm-414456434743.asia-southeast1.run.app`
    *   `localhost`
