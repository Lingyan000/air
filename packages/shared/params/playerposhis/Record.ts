import { Static, Type } from '@sinclair/typebox';

export const Record = Type.Object({
  playurl: Type.String(),
  pos: Type.Number(),
});

export type Record = Static<typeof Record>;
