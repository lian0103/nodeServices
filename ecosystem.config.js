module.exports = {
  apps: [
    {
      script: 'index.js',
      watch: '.',
    },
  ],
  deploy: {
    production: {
      ref: 'origin/main',
      repo: 'https://github.com/lian0103/nodeServices',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
