module.exports = {
  apps : [{
    name: "edc.nssce",
    script: "node ./bin/www",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}

