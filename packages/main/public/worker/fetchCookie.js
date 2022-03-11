const { runAsWorker } = require('sync-threads');

runAsWorker(async ({ url, config = {} }) => {
  const got = (await require('../esm-got.cjs')).default;
  return got(url, config).then((res) => {
    return JSON.stringify(res.headers['set-cookie']);
  });
});
