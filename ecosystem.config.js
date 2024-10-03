module.exports = {
    apps: [
      {
        name: 'roya-technology-app', // Application name
        script: 'npm', // Command to run
        args: 'run start', // Command arguments
        max_memory_restart: '400M', // Restart if memory usage exceeds 400MB (balance between 1GB total RAM)
        instances: 1,  // Run only 1 instance (no clustering for 1 CPU)
        exec_mode: 'fork', // Fork mode (no clustering)
        restart_delay: 0,
        node_args: '--max-old-space-size=384', // Max old memory size set to 384MB to avoid OOM
        autorestart: true, // Automatically restart if the app crashes
        watch: false, // Disable file watching to save resources
      },
    ],
  };
  