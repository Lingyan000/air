const isDevelopment = import.meta.env.MODE === 'development';

export const MAIN_WINDOW_URL =
  isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : 'airr://./renderer/dist/index.html';
