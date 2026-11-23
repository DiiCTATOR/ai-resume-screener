# AI Resume Screener (MERN)

A full-stack web application featuring an Express/Node.js backend and a Vite React frontend with automated GitHub Actions CI/CD deployment.

## Project Structure

```
├── .github/workflows/   # Automated CI/CD deployment pipeline
├── backend_ai/          # Express.js API server & static file host
│   ├── build/           # Compiled frontend production assets
│   └── uploads/         # Temporary resume upload storage
├── mern_ai/             # Vite + React client source
├── ecosystem.config.js  # PM2 production configuration for AWS EC2
├── package.json         # Unified root scripts for build & run
├── .gitignore           # Git ignore rules for root, client, and server
├── .gitattributes       # Normalized line ending configuration
```

## Quick Start (Local)

From the project root:

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   - Copy `backend_ai/.env.example` to `backend_ai/.env` and add your MongoDB URI & Cohere API key.
   - Copy `mern_ai/.env.example` to `mern_ai/.env` and add your Firebase credentials.

3. **Build Frontend into Backend `build/`:**
   ```bash
   npm run build
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```
   The entire application (API + React UI) is served on `http://localhost:4000`.

---

## Automated Deployment (GitHub Actions)

Deployments are automated through a self-hosted runner on AWS EC2. Whenever changes are pushed to `main`, GitHub Actions automatically:
1. Pulls the latest code to the EC2 instance.
2. Checks dependency hashes and installs packages only when dependencies change.
3. Compiles the React frontend.
4. Reloads the Node.js application via PM2 with zero downtime.
5. Verifies backend health via `GET /api/health`.

## License

MIT
