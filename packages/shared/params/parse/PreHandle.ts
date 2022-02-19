import { Static, Type } from '@sinclair/typebox';

export const PreHandle = Type.Object({
  id: Type.Number(),
});

export type PreHandle = Static<typeof PreHandle>;
