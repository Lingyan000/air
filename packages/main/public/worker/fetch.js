// const iconv = require('iconv-lite');
const { runAsWorker } = require('sync-threads');

runAsWorker(async ({ url, config = {} }) => {
  const got = (await require('../esm-got.cjs')).default;
  const instance = got.extend({ followRedirect: config.redirect !== false });
  return instance(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 Edg/98.0.4758.80',
      ...(config.headers || {}),
    },
    method: config.method || 'GET',
    body: config.body,
    responseType: config.toHex ? 'buffer' : 'text',
  }).then((response) => {
    // const data = iconv.decode(response, 'utf-8');
    let body = response.body;
    if (config.toHex) {
      body = Buffer.from(body).toString('hex');
    }
    if (config.withStatusCode) {
      return JSON.stringify({
        body,
        statusCode: response.statusCode,
      });
    } else {
      return body;
    }
  });
});
