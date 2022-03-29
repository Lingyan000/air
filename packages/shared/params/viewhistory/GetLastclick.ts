import { Static, Type } from '@sinclair/typebox';

export const GetLastclick = Type.Object({
  title: Type.String(),
  url: Type.String(),
});

export type GetLastclick = Static<typeof GetLastclick>;
