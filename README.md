# AI Resume Analyzer (MERN)

A full-stack web application featuring an Express/Node.js backend and a Vite React frontend.

## Project Structure

```
├── backend_ai/          # Express.js API server & static file host
│   ├── build/           # Compiled frontend production assets
│   └── uploads/         # Temporary resume upload storage
├── mern_ai/             # Vite + React client source
├── ecosystem.config.js  # PM2 production configuration for AWS EC2
├── deploy.sh            # Automated EC2 deployment script
├── nginx.conf.example   # Nginx reverse proxy configuration template
├── package.json         # Unified root scripts for build & run
├── .gitignore           # Git ignore rules for root, client, and server
├── .gitattributes       # Normalized line ending configuration
```

## Quick Start (Local)

From the project root:

1. **Install all dependencies:**
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

4. **Start the Production Server:**
   ```bash
   npm start
   ```
   The entire application (API + React UI) is served on `http://localhost:4000`.

---

## AWS EC2 Deployment (Turnkey)

### 1. Security Group
Make sure your AWS EC2 Security Group allows:
- **Port 22** (SSH)
- **Port 4000** (or Port 80/443 for HTTP/HTTPS)

### 2. One-Command Deploy on EC2
SSH into your Ubuntu/Debian EC2 instance and run:

```bash
git clone https://github.com/DiiCTATOR/ai-resume-screener.git
cd ai-resume-screener
chmod +x deploy.sh
./deploy.sh
```

The script will automatically:
- Install Node.js 22 LTS (if missing)
- Install all dependencies
- Compile the React frontend into `backend_ai/build`
- Launch and daemonize the app with **PM2** (`ecosystem.config.js`)
- Persist the process across EC2 server reboots

### 3. Manage with PM2
```bash
pm2 status                       # View app status
pm2 logs ai-resume-screener      # View live logs
pm2 restart ai-resume-screener   # Restart the app
pm2 stop ai-resume-screener      # Stop the app
```

## License

MIT
