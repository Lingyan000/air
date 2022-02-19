const { runAsWorker } = require('synckit');

runAsWorker(async (url, config = '{}') => {
  const got = (await require('../esm-got.cjs')).default;
  config = JSON.parse(config);
  return got(url, config).then((res) => {
    return JSON.stringify(res.headers['set-cookie']);
  });
});
