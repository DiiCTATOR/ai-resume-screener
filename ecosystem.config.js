module.exports = {
  apps: [
    {
      name: "ai-resume-screener",
      script: "backend_ai/index.js",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
