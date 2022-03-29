import { Static, Type } from '@sinclair/typebox';

export const All = Type.Object({
  currentPage: Type.Number(),
  pageSize: Type.Number(),
});

export type All = Static<typeof All>;
