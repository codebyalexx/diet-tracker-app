module.exports = {
  apps: [
    {
      name: "Tracker App",
      script: "pnpm",
      args: "dev -p 4010",
      env: {
        TZ: "Europe/Paris",
      },
    },
  ],
};
