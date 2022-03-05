import { session } from 'electron';
import { URL } from 'url';

export function setDefaultHeaders() {
  const filter = {
    urls: ['*://*:*/*'],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const url = new URL(details.url);
    details.requestHeaders['Origin'] = url.origin;
    details.requestHeaders['Referer'] = details.url;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}
