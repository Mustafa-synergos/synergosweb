/**
 * PM2 config for Next.js (run from frontend directory).
 *
 *   cd frontend
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'synergos-frontend',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      merge_logs: true,
      time: true,
    },
  ],
};
