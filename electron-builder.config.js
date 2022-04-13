if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  npmRebuild: false,
  appId: 'com.Lingyan000.air',
  productName: '空气',
  fileAssociations: {
    ext: ['.hiker'],
  },
  publish: [
    {
      provider: 'github',
      owner: 'Lingyan000',
      repo: 'air',
      releaseType: 'draft',
    },
  ],
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  copyright: 'Copyright © 2022',
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
  nsis: {
    deleteAppDataOnUninstall: true,
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    shortcutName: '空气',
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: [process.arch],
      },
    ],
  },
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  snap: {
    publish: ['github'],
  },
};

module.exports = config;
