// const iconv = require('iconv-lite');
const { runAsWorker } = require('synckit');

runAsWorker(async (url, config = '{}') => {
  const got = (await require('../esm-got.cjs')).default;
  config = JSON.parse(config);
  const instance = got.extend({ followRedirect: config.redirect !== false });
  return instance(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 Edg/98.0.4758.80',
      ...(config.headers || {}),
    },
    method: config.method || 'GET',
    body: config.body,
  }).then((response) => {
    // const data = iconv.decode(response, 'utf-8');
    const body = response.body;
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