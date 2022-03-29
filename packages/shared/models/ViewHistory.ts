import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const ViewHistory = Type.Object(
  {
    id: Type.Number(),
    lastclick: Type.String(),
    params: Type.String(),
    rulebaseurl: Type.String(),
    time: Type.Number(),
    title: Type.String(),
    type: Type.String(),
    url: Type.String(),
    videourl: Type.String(),
    group_lpcolumn: Type.String(),
    picurl: Type.String(),
    extradata: Type.String(),
  },
  { $id: 'ViewHistory', title: 'ViewHistory', description: 'ViewHistory' }
);

export type ViewHistory = Static<typeof ViewHistory>;
