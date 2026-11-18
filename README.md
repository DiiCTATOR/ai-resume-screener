# AI Resume Analyzer (MERN)

A full-stack web application featuring an Express/Node.js backend and a Vite React frontend.

## Project Structure

```
├── backend_ai/       # Express.js API server & static file host
│   ├── build/        # Compiled frontend production assets
│   └── uploads/      # Temporary resume upload storage
├── mern_ai/          # Vite + React client source
├── package.json      # Unified root scripts for build & run
├── .gitignore        # Git ignore rules for root, client, and server
├── .gitattributes    # Normalized line ending configuration
```

## Quick Start (Unified)

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

## Development Mode (Separate Ports)

- **Backend (Port 4000):**
  ```bash
  npm run dev:backend
  ```
- **Frontend (Port 5173 with Vite proxy to :4000):**
  ```bash
  npm run dev:frontend
  ```

## License

MIT
