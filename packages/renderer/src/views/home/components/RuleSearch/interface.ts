import { InjectionKey, Ref } from 'vue';
import * as Models from '#/models';

export interface HomeRuleSearchInjection {
  activeIdRef: Ref<number | null>;
  popMaxHeight: Ref<number | undefined>;
  searchRuleList: Ref<Models.Articlelistrules>;
  lastSearchRuleList: Ref<Models.Articlelistrules>;
}

export const homeRuleSearchInjectionKey: InjectionKey<HomeRuleSearchInjection> =
  Symbol('homeRuleSearch');
