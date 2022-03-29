import { inject } from 'vue';
import { airApiInjectionKey } from './context';

export function useAir() {
  const api = inject(airApiInjectionKey, null);
  if (api === null) {
    throw new Error('[airApiInjectionKey] api is null');
  }
  return api;
}
