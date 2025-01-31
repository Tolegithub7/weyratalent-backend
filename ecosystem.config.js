module.exports = {
    apps: [
      {
        name: "server",
        script: "./src/index.ts",
        interpreter: "node",
        interpreterArgs: "--import tsx",
      },
    ],
  };
  