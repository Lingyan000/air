/* eslint-env node */
import { loadEnv } from 'vite';
import { chrome } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import pkg from '../../package.json';
import { format } from 'date-fns';

const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

const PACKAGE_ROOT = __dirname;

/**
 * @type {({ command, mode }: import('vite').ConfigEnv) => import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default ({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT } = viteEnv;
  const isBuild = command === 'build';
  return {
    root: PACKAGE_ROOT,
    resolve: {
      alias: {
        '/@/': join(PACKAGE_ROOT, 'src') + '/',
        '#/': join(PACKAGE_ROOT, '../shared') + '/',
        '~assets': join(PACKAGE_ROOT, 'assets') + '/',
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    base: VITE_PUBLIC_PATH,
    server: {
      port: VITE_PORT,
      fs: {
        strict: true,
      },
    },
    build: {
      sourcemap: true,
      target: `chrome${chrome}`,
      outDir: OUTPUT_DIR,
      assetsDir: '.',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      rollupOptions: {
        input: join(PACKAGE_ROOT, 'index.html'),
        external: [...builtinModules],
      },
      emptyOutDir: true,
      brotliSize: false,
    },
  };
};
