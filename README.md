# Nipnetic Shopify-Ready Site

This repository contains your static site wired for Shopify.

## Setup Instructions

1. Open any HTML file (e.g., `bassskin.html`) and paste your **Storefront API token** into the global config inside the `<script>` block.

   ```html
   <script>
     window.__SHOPIFY_CONFIG__ = {
       shop: "nipnetic.myshopify.com",
       token: "your-public-storefront-api-token",
       version: "2024-07"
     };
   </script>
   ```

2. Commit and push this repo to GitHub:

   ```bash
   git add .
   git commit -m "Initial Shopify-ready site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Enable **GitHub Pages**:
   - Go to your repository on GitHub.
   - Open **Settings → Pages**.
   - Select branch **main** and folder `/root`.
   - Save. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

4. Verify products load on collection pages:
   - `bassskin.html`
   - `hardsignal.html`
   - `sukimod.html`

If you see errors, open the browser console — the script logs clear error messages for missing/invalid tokens or API issues.
