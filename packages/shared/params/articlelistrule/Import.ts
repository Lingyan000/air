import { Static, Type } from '@sinclair/typebox';

export const ImportRule = Type.Object({
  password: Type.String(),
});

export type ImportRule = Static<typeof ImportRule>;
