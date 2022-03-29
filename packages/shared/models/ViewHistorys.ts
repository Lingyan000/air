import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { ViewHistory } from './ViewHistory';

export const ViewHistorys = Type.Array(ViewHistory, {
  $id: 'ViewHistorys',
  title: 'ViewHistorys',
  description: 'ViewHistorys',
});

export type ViewHistorys = Static<typeof ViewHistorys>;
