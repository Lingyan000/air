import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Articlelistrule } from './Articlelistrule';

export const Articlelistrules = Type.Array(Articlelistrule, {
  $id: 'Articlelistrules',
  title: 'Articlelistrules',
  description: 'Articlelistrules',
});

export type Articlelistrules = Static<typeof Articlelistrules>;
