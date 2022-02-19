import { InjectionKey, Ref } from 'vue';

export interface AirHomeComponentInjection {
  picUrlRef: Ref<string>;
  titleRef: Ref<string>;
  descRef: Ref<string>;
  urlRef: Ref<string>;
}

export const airHomeComponentInjectionKey: InjectionKey<AirHomeComponentInjection> = Symbol('home');
