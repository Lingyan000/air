import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const Articlelistrule = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    icon: Type.String(),
    col_type: Type.String(),
    detail_col_type: Type.String(),
    detail_find_rule: Type.String(),
    find_rule: Type.String(),
    firstheader: Type.String(),
    group_lpcolumn: Type.String(),
    prerule: Type.String(),
    sdetail_col_type: Type.String(),
    sdetail_find_rule: Type.String(),
    searchfind: Type.String(),
    search_url: Type.String(),
    sort_name: Type.String(),
    sort_url: Type.String(),
    titlecolor: Type.String(),
    ua: Type.String(),
    url: Type.String(),
  },
  { $id: 'Articlelistrule', title: 'Articlelistrule', description: 'Articlelistrule' }
);

export type Articlelistrule = Static<typeof Articlelistrule>;
