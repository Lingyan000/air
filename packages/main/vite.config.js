import { node } from '../../electron-vendors.config.json';
import { join, resolve } from 'path';
import { builtinModules } from 'module';
import { loadEnv } from 'vite';

const PACKAGE_ROOT = __dirname;

const root = process.cwd();
const env = loadEnv(process.env.MODE, root);

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  define: {
    HK_PRIVATE_KEY: (
      env.VITE_HK_PRIVATE_KEY || 'YWlyMTExMTExOTk5NjY2MzMzMzIyMjIwMDAwMDAwMDA='
    ).split(''),
  },
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '#/': join(PACKAGE_ROOT, '../shared') + '/',
    },
  },
  // esbuild: false,
  build: {
    commonjsOptions: {
      dynamicRequireTargets: ['node_modules/got-cjs/dist/source/index.js:'],
    },
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.ts'),
        // child_process: resolve(__dirname, 'src/child_process.ts'),
        // airVm: resolve(__dirname, 'src/apis/core/air/utils/airVm.ts'),
        airVmWorker: resolve(__dirname, 'src/apis/core/air/utils/airVmWorker.ts'),
      },
      external: [
        'electron',
        'electron-devtools-installer',
        'sqlite3',
        'sequelize',
        'dayjs',
        'express',
        'cheerio',
        'vm2',
        'body-parser',
        'iconv-lite',
        'got',
        'util',
        'lowdb',
        'comment-json',
        'lodashId',
        'nanoid',
        'hpagent',
        'global-agent',
        'axios',
        'deasync',
        'synckit',
        'webdav',
        'adm-zip',
        'query-string',
        'socket.io',
        '@nestjs/core',
        '@nestjs/common',
        '@nestjs/swagger',
        '@nestjs/platform-express',
        'rxjs',
        'reflect-metadata',
        'sequelize-typescript',
        '@nestjs/sequelize',
        'fastify',
        'fastify-cors',
        '@jonahsnider/util',
        '@sinclair/typebox',
        '@sentry/node',
        'fastify-swagger',
        'crypto-js',
        'fastify-cookie',
        'bytenode',
        'fastify-server-session',
        'fastify-caching',
        'xregexp',
        'async',
        'piscina',
        'electron-window-state',
        ...builtinModules,
      ],
      output: {
        entryFileNames: '[name].cjs',
        format: 'cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  // plugins: [
  //   RollupPluginSwc({
  //     jsc: {
  //       target: 'es2019',
  //       parser: {
  //         syntax: 'typescript',
  //         decorators: true,
  //       },
  //       transform: {
  //         legacyDecorator: true,
  //         decoratorMetadata: true,
  //       },
  //     },
  //   }),
  // ],
};

export default config;
