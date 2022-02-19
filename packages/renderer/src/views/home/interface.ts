import { InjectionKey, Ref } from 'vue';

export interface HomeInjection {
  ruleListRef: Ref<any[]>;
  showRuleDrawerRef: Ref<boolean>;
  activeNameRef: Ref<string | undefined>;
}

export const homeInjectionKey: InjectionKey<HomeInjection> = Symbol('home');
