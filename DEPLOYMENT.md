# 🚀 Deploying Hamster Space Race to Railway

## Prerequisites
- A [Railway account](https://railway.app/) (free tier available)
- Git installed on your computer
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deploy Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Railway**:
   - Visit [railway.app](https://railway.app/)
   - Sign up or log in
   - Click "New Project"

3. **Deploy from GitHub**:
   - Select "Deploy from GitHub repo"
   - Choose your Hamster Space Race repository
   - Railway will auto-detect the configuration

4. **Wait for deployment**:
   - Railway will automatically:
     - Install dependencies (`npm install`)
     - Build the project (`npm run build`)
     - Start the server (`npm start`)
   - This usually takes 2-3 minutes

5. **Get your URL**:
   - Once deployed, Railway will provide a public URL
   - Click "Generate Domain" if not automatically generated
   - Your game will be live at: `https://your-app.railway.app`

### Option 2: Deploy with Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize and deploy**:
   ```bash
   railway init
   railway up
   ```

4. **Generate domain**:
   ```bash
   railway domain
   ```

## Configuration Files

The following files have been configured for Railway deployment:

- ✅ `package.json` - Added `start` script and `serve` dependency
- ✅ `railway.json` - Railway build and deploy configuration
- ✅ `serve.json` - Static file server configuration with SPA routing
- ✅ `.railwayignore` - Files to exclude from deployment

## Environment Variables

This project doesn't require any environment variables for basic deployment.

## Troubleshooting

### Build fails:
- Check that all dependencies are listed in `package.json`
- Ensure `node_modules` is in `.gitignore`

### Routes don't work (404 errors):
- The `serve.json` configuration handles this automatically
- All routes redirect to `index.html` for React Router

### Server won't start:
- Check Railway logs for errors
- Ensure the `PORT` environment variable is being used (Railway sets this automatically)

## Cost

Railway offers:
- **Free tier**: $5 of usage per month
- **Hobby plan**: $5/month for more resources
- This static site should easily fit within the free tier!

## Custom Domain (Optional)

To use your own domain:
1. Go to your Railway project settings
2. Click on "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

## Updating Your Deployment

Whenever you push new code to your GitHub repository:
1. `git add .`
2. `git commit -m "Your update message"`
3. `git push`
4. Railway will automatically rebuild and redeploy!

---

🎉 **Your Hamster Space Race game is now live!** Share the URL with friends and let them race their hamsters to Earth!


