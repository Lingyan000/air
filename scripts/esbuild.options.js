const { join } = require('path');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');
const { builtinModules } = require('module');

const define = {};
for (const k in process.env) {
  if (['ProgramFiles(x86)', 'CommonProgramFiles(x86)'].includes(k)) continue;
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

/**
 * @type {import('esbuild').BuildOptions}
 */
module.exports = {
  createOptions() {
    return {
      sourcemap: 'inline',
      entryPoints: [join(__dirname, '../packages/main/src/child_process.ts')],
      target: 'es2020',
      outfile: join(__dirname, '../packages/main/dist_child_process/index.js'),
      format: 'cjs',
      bundle: true,
      platform: 'node',
      define,
      tsconfig: join(__dirname, '../packages/main/tsconfig.json'),
      plugins: [
        esbuildDecorators({
          tsconfig: join(__dirname, '../packages/main/tsconfig.json'),
        }),
      ],
      external: [
        ...builtinModules.filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x)),
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
        '@mgcrea/fastify-session',
        '@mgcrea/fastify-session-sodium-crypto',
        'bytenode',
      ],
    };
  },
};
