import { Static, Type } from '@sinclair/typebox';

export const GetPos = Type.Object({
  playurl: Type.String(),
});

export type GetPos = Static<typeof GetPos>;
