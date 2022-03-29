import { InjectionKey } from 'vue';
import { DetailPanelOption } from '/@/components/DetailPanel/DetailPanel.vue';
import { Object } from 'ts-toolbelt';
import * as Models from '#/models';

export interface AirApiInjection {
  showViewHistory: () => void;
  showDetailPanel: (option: DetailPanelOption) => void;
  showPlayerPanel: (title: string, url: string, item: HikerResultOption, otherOptions: any) => void;
  showSearchPanel: (
    articlelistrule: Object.Optional<Models.Articlelistrule>,
    value: string
  ) => void;
}

export const airApiInjectionKey: InjectionKey<AirApiInjection> = Symbol('airApiInjection');
