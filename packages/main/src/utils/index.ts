import { session } from 'electron';

export function setDefaultHeaders() {
  const filter = {
    urls: ['*://*/*'],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    // @ts-ignore
    details.requestHeaders['Origin'] = undefined;
    // @ts-ignore
    details.requestHeaders['Referer'] = undefined;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}
